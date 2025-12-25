import { prisma } from "@/lib/database/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function checkHolidayNotifications() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Skip if tomorrow is Sunday
  if (tomorrow.getDay() === 0) {
    console.log(
      "[SCHEDULER] Tomorrow is Sunday, skipping holiday notification"
    );
    return;
  }

  // Find holiday tomorrow using AcademicEvent
  const holiday = await prisma.academicEvent.findFirst({
    where: {
      type: "HOLIDAY",
      startDate: { lte: tomorrow },
      endDate: { gte: tomorrow },
      isPublished: true,
    },
  });

  if (!holiday) {
    console.log("[SCHEDULER] No holiday found for tomorrow");
    return;
  }

  console.log(`[SCHEDULER] Found holiday tomorrow: ${holiday.title}`);

  // Send to all teachers
  const teachers = await prisma.teacher.findMany({
    where: { isActive: true },
  });

  for (const teacher of teachers) {
    if (teacher.phone) {
      await sendWhatsAppMessage(
        teacher.phone,
        `*Informasi Hari Libur*\n\nBesok ${holiday.title}. Sekolah libur. Sampai jumpa lagi!`
      );
    }
  }

  // Send to all students
  const students = await prisma.student.findMany({
    where: { isActive: true },
  });

  for (const student of students) {
    if (student.phone) {
      await sendWhatsAppMessage(
        student.phone,
        `*Informasi Hari Libur*\n\nBesok ${holiday.title}. Sekolah libur. Sampai jumpa lagi!`
      );
    }
  }

  console.log(
    `[SCHEDULER] Holiday notifications sent to ${teachers.length} teachers and ${students.length} students`
  );
}

export async function checkSchoolEntryNotifications() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if today is a holiday
  const todayHoliday = await prisma.academicEvent.findFirst({
    where: {
      type: "HOLIDAY",
      startDate: { lte: today },
      endDate: { gte: today },
      isPublished: true,
    },
  });

  if (!todayHoliday) {
    console.log(
      "[SCHEDULER] Today is not a holiday, skipping school entry notification"
    );
    return;
  }

  // Check if tomorrow is NOT a holiday and NOT Sunday
  const tomorrowHoliday = await prisma.academicEvent.findFirst({
    where: {
      type: "HOLIDAY",
      startDate: { lte: tomorrow },
      endDate: { gte: tomorrow },
      isPublished: true,
    },
  });

  if (tomorrowHoliday) {
    console.log(
      "[SCHEDULER] Tomorrow is also a holiday, skipping school entry notification"
    );
    return;
  }

  if (tomorrow.getDay() === 0) {
    console.log(
      "[SCHEDULER] Tomorrow is Sunday, skipping school entry notification"
    );
    return;
  }

  console.log(
    `[SCHEDULER] School entry notification after ${todayHoliday.title}`
  );

  // Send reminder to all teachers and students
  const teachers = await prisma.teacher.findMany({
    where: { isActive: true },
  });

  for (const teacher of teachers) {
    if (teacher.phone) {
      await sendWhatsAppMessage(
        teacher.phone,
        `*Informasi Masuk Sekolah*\n\nBesok masuk sekolah seperti biasa setelah libur ${todayHoliday.title}. Jangan lupa persiapkan diri!`
      );
    }
  }

  const students = await prisma.student.findMany({
    where: { isActive: true },
  });

  for (const student of students) {
    if (student.phone) {
      await sendWhatsAppMessage(
        student.phone,
        `*Informasi Masuk Sekolah*\n\nBesok masuk sekolah seperti biasa setelah libur ${todayHoliday.title}. Jangan lupa persiapkan diri!`
      );
    }
  }

  console.log(`[SCHEDULER] School entry notifications sent`);
}

export async function checkConsecutiveAbsences() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  threeDaysAgo.setHours(0, 0, 0, 0);

  const students = await prisma.student.findMany({
    where: { isActive: true },
    include: {
      attendances: {
        where: {
          date: { gte: threeDaysAgo },
          status: "ALPHA",
        },
        orderBy: { date: "desc" },
      },
    },
  });

  let notificationCount = 0;

  for (const student of students) {
    if (student.attendances.length >= 3) {
      // Check if dates are consecutive
      const dates = student.attendances.map((a) => new Date(a.date).getTime());
      dates.sort((a, b) => b - a); // Sort descending

      let isConsecutive = true;
      for (let i = 0; i < 2; i++) {
        const diff = (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);
        if (diff !== 1) {
          isConsecutive = false;
          break;
        }
      }

      if (isConsecutive && student.phone) {
        const dateStrings = student.attendances
          .slice(0, 3)
          .map((a) => new Date(a.date).toLocaleDateString("id-ID"))
          .join("\n- ");

        await sendWhatsAppMessage(
          student.phone,
          `*⚠️ Peringatan Ketidakhadiran*\n\nAnda telah tidak masuk sekolah (ALPHA) selama 3 hari berturut-turut:\n- ${dateStrings}\n\nHarap segera konfirmasi kehadiran atau hubungi pihak sekolah.`
        );

        notificationCount++;
      }
    }
  }

  console.log(
    `[SCHEDULER] Consecutive absence alerts sent to ${notificationCount} students`
  );
}
