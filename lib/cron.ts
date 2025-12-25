import cron from "node-cron";
import {
  checkHolidayNotifications,
  checkSchoolEntryNotifications,
  checkConsecutiveAbsences,
} from "./scheduler";

let cronInitialized = false;

// Run at 6 PM daily (18:00)
const holidayJob = cron.schedule(
  "0 18 * * *",
  async () => {
    console.log("[CRON] Running holiday and school entry notifications...");
    try {
      await checkHolidayNotifications();
      await checkSchoolEntryNotifications();
      console.log("[CRON] Holiday notifications completed");
    } catch (error) {
      console.error("[CRON] Error in holiday notifications:", error);
    }
  },
  {
    scheduled: false, // Don't start automatically
  }
);

// Run at 7 PM daily (19:00)
const absenceJob = cron.schedule(
  "0 19 * * *",
  async () => {
    console.log("[CRON] Running consecutive absence check...");
    try {
      await checkConsecutiveAbsences();
      console.log("[CRON] Absence check completed");
    } catch (error) {
      console.error("[CRON] Error in absence check:", error);
    }
  },
  {
    scheduled: false, // Don't start automatically
  }
);

export function initCronJobs() {
  if (cronInitialized) {
    console.log("[CRON] Cron jobs already initialized");
    return;
  }

  holidayJob.start();
  absenceJob.start();
  cronInitialized = true;

  console.log("[CRON] ✓ Cron jobs initialized");
  console.log("[CRON] ✓ Holiday notifications: Daily at 18:00");
  console.log("[CRON] ✓ Absence alerts: Daily at 19:00");
}
