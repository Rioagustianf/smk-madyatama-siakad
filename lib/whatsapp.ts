import { prisma } from "@/lib/database/prisma";

export async function getWhatsAppConfig() {
  const settings = await prisma.siteSettings.findFirst();
  return {
    token: settings?.whatsappToken,
    name: settings?.whatsappName,
  };
}

export async function sendWhatsAppMessage(target: string, message: string) {
  try {
    const { token } = await getWhatsAppConfig();
    if (!token) {
      console.warn("WhatsApp Token not configured.");
      return false;
    }

    // Fonnte API
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target,
        message,
      }),
    });

    const result = await response.json();
    if (!result.status) {
      console.error("Fonnte Send Error:", result);
    }
    return result.status;
  } catch (error) {
    console.error("WhatsApp Send Error:", error);
    return false;
  }
}

export async function getFonnteQr(token: string) {
  try {
    const response = await fetch("https://api.fonnte.com/qr", {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    // Fonnte returns JSON with url (base64) or direct image?
    // Documentation says it returns JSON { status: true, url: "base64..." }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Get QR Error:", error);
    return null;
  }
}

export async function getFonnteStatus(token: string) {
  try {
    const response = await fetch("https://api.fonnte.com/device", {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Get Fonnte Status Error:", error);
    return null;
  }
}
