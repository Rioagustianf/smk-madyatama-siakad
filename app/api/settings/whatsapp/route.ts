import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getFonnteQr, getFonnteStatus } from "@/lib/whatsapp";

const ACCOUNT_TOKEN = process.env.FONNTE_ACCOUNT_TOKEN || "";

export async function GET() {
  try {
    // First, fetch all devices from Fonnte Account
    if (!ACCOUNT_TOKEN) {
      return NextResponse.json({
        success: false,
        message: "Account Token not configured",
        connected: false,
      });
    }

    // Fonnte uses POST for device list
    const response = await fetch("https://api.fonnte.com/get-devices", {
      method: "POST",
      headers: {
        Authorization: ACCOUNT_TOKEN,
      },
    });

    const result = await response.json();
    const devices = result.data || [];

    // Get local settings
    const settings = await prisma.siteSettings.findFirst();

    return NextResponse.json({
      success: true,
      devices: devices,
      localDevice: settings
        ? {
            token: settings.whatsappToken,
            name: settings.whatsappName,
          }
        : null,
    });
  } catch (error) {
    console.error("Get Devices Error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching devices" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, deviceName, deviceToken, deviceNumber } = body;

    // Link Existing Device (using existing device token from Fonnte account)
    if (action === "link_device") {
      if (!deviceToken) {
        return NextResponse.json(
          { success: false, message: "Device token required" },
          { status: 400 }
        );
      }

      // Save the Device Token to database
      let settings = await prisma.siteSettings.findFirst();
      if (settings) {
        await prisma.siteSettings.update({
          where: { id: settings.id },
          data: {
            whatsappToken: deviceToken,
            whatsappName: deviceName || "SMK Device",
          },
        });
      } else {
        await prisma.siteSettings.create({
          data: {
            whatsappToken: deviceToken,
            whatsappName: deviceName || "SMK Device",
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Device linked successfully",
      });
    }

    // Add New Device (Create new device using Account Token)
    if (action === "add_device") {
      if (!ACCOUNT_TOKEN) {
        return NextResponse.json(
          { success: false, message: "Account Token not configured in .env" },
          { status: 500 }
        );
      }

      if (!deviceNumber) {
        return NextResponse.json(
          { success: false, message: "Device number is required" },
          { status: 400 }
        );
      }

      // Call Fonnte API to create a new device using form data
      const formData = new URLSearchParams();
      formData.append("name", deviceName || "SMK Device");
      formData.append("device", deviceNumber);
      formData.append("autoread", "false");
      formData.append("personal", "false");
      formData.append("group", "false");

      const response = await fetch("https://api.fonnte.com/add-device", {
        method: "POST",
        headers: {
          Authorization: ACCOUNT_TOKEN,
        },
        body: formData,
      });

      const result = await response.json();

      if (!result.status) {
        return NextResponse.json(
          { success: false, message: result.reason || "Failed to add device" },
          { status: 400 }
        );
      }

      // Save the Device Token to database
      let settings = await prisma.siteSettings.findFirst();
      if (settings) {
        await prisma.siteSettings.update({
          where: { id: settings.id },
          data: {
            whatsappToken: result.token, // Device Token
            whatsappName: deviceName || "SMK Device",
          },
        });
      } else {
        await prisma.siteSettings.create({
          data: {
            whatsappToken: result.token,
            whatsappName: deviceName || "SMK Device",
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Device added. Please scan QR code.",
        deviceToken: result.token,
      });
    }

    // Get QR Code (using Device Token)
    if (action === "get_qr") {
      const { token } = body;
      const deviceTokenToUse =
        token || (await prisma.siteSettings.findFirst())?.whatsappToken;

      if (!deviceTokenToUse) {
        return NextResponse.json(
          {
            success: false,
            message: "No device found. Please select a device first.",
          },
          { status: 400 }
        );
      }

      const qrData = await getFonnteQr(deviceTokenToUse);
      return NextResponse.json({ success: true, data: qrData });
    }

    // Disconnect Device
    if (action === "disconnect") {
      const { token: deviceToken } = body;

      if (!deviceToken) {
        return NextResponse.json(
          { success: false, message: "Device token required" },
          { status: 400 }
        );
      }

      // Call Fonnte disconnect API using device token
      const response = await fetch("https://api.fonnte.com/disconnect", {
        method: "POST",
        headers: { Authorization: deviceToken },
      });

      const result = await response.json();

      // If this device is currently linked, clear from database
      const settings = await prisma.siteSettings.findFirst();
      if (settings && settings.whatsappToken === deviceToken) {
        await prisma.siteSettings.update({
          where: { id: settings.id },
          data: { whatsappToken: null, whatsappName: null },
        });
      }

      return NextResponse.json({
        success: true,
        message: result.detail || "Device disconnected",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("WhatsApp Settings Error:", error);
    return NextResponse.json(
      { success: false, message: "Error processing request" },
      { status: 500 }
    );
  }
}
