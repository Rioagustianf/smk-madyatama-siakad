import { prisma } from "@/lib/database/prisma";
import { sendWhatsAppMessage } from "./whatsapp";

// Helper to get phone number from User ID based on their role
async function getUserPhone(userId: string): Promise<string | null> {
  // Try Student
  const student = await prisma.student.findUnique({ where: { id: userId } });
  if (student && student.phone) return student.phone;

  // Try Teacher
  const teacher = await prisma.teacher.findUnique({ where: { id: userId } });
  if (teacher && teacher.phone) return teacher.phone;

  // Try Staff
  // Assuming Staff has phone? Let's check schema/add it if needed.
  // Staff model usually doesn't need WA notifs as much, but let's check.

  return null;
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" = "INFO",
  link?: string,
  sendWa = false
) {
  try {
    // 1. Create In-App Notification
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });

    // 2. Send WhatsApp if requested
    if (sendWa) {
      const phone = await getUserPhone(userId);
      if (phone) {
        // Fonnte recommends minimal content or templates to avoid blocking.
        // Formatting bold with *text*
        await sendWhatsAppMessage(phone, `*${title}*\n\n${message}`);
      }
    }
  } catch (error) {
    console.error("Create Notification Error:", error);
  }
}
