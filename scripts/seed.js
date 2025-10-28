#!/usr/bin/env node

/**
 * Database Seeder Script
 *
 * Menjalankan seeder untuk mengisi database dengan data awal
 *
 * Usage:
 *   npm run seed
 *   node scripts/seed.js
 */

const { execSync } = require("child_process");
const path = require("path");

async function main() {
  try {
    console.log("🌱 Starting database seeding with Prisma/MySQL...");
    console.log(
      "⚠️  Pastikan MySQL sudah berjalan dan DATABASE_URL sudah di-set di .env"
    );

    // Run the seeder via API endpoint
    const result = await fetch("http://localhost:3000/api/seed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    const data = await result.json();

    console.log("\n📊 Seeding Results:");
    console.log(`   🎓 Majors: ${data.data.majors}`);
    console.log(`   👥 Students: ${data.data.students}`);
    console.log(`   👨‍🏫 Teachers: ${data.data.teachers}`);
    console.log(`   📚 Subjects: ${data.data.subjects}`);
    console.log(`   🏫 Classes: ${data.data.classes}`);
    console.log(`   📅 Schedules: ${data.data.schedules}`);
    console.log(`   👤 Admins: ${data.data.admins}`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Default Login Credentials:");
    console.log("   Admin: admin / admin123");
    console.log("   Teacher: iik_ayu / password123");
    console.log("   Student: 0091128942 / password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    console.log("\n💡 Pastikan:");
    console.log("   1. Development server sudah berjalan (npm run dev)");
    console.log("   2. MySQL server sudah running");
    console.log("   3. DATABASE_URL di .env sudah benar");
    console.log("   4. Prisma client sudah di-generate (npx prisma generate)");
    console.log("   5. Database schema sudah di-push (npx prisma db push)");
    process.exit(1);
  }
}

// Run the seeder
main();
