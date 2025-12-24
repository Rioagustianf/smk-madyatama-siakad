import { prisma } from "@/lib/database/prisma";
import bcrypt from "bcryptjs";

export async function seedStaff() {
  console.log("👤 Seeding staff keuangan...");

  const hashedPassword = await bcrypt.hash("staff123", 10);

  const staff = await prisma.staff.upsert({
    where: { username: "staff_keuangan" },
    update: {},
    create: {
      name: "Staff Keuangan",
      username: "staff_keuangan",
      password: hashedPassword,
      role: "finance",
      position: "Staff Keuangan",
      department: "Keuangan",
      email: "keuangan@smkmadyatama.sch.id",
      phone: "081234567890",
      isActive: true,
    },
  });

  console.log("✅ Seeded staff keuangan");
  return staff;
}

// Run if called directly
if (require.main === module) {
  seedStaff()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
