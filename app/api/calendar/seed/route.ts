import { NextRequest, NextResponse } from "next/server";
import { getAcademicEventsRepository } from "@/lib/database/repository";

export async function POST(request: NextRequest) {
  try {
    const { year } = await request.json();
    const targetYear = year || new Date().getFullYear();

    // Fetch holidays from Nager.Date API (supports multiple years ahead)
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${targetYear}/ID`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch holidays from API" },
        { status: 500 }
      );
    }

    const holidays = await response.json();

    if (!Array.isArray(holidays)) {
      return NextResponse.json(
        { error: "Invalid response from holiday API" },
        { status: 500 }
      );
    }

    const repo = getAcademicEventsRepository();

    // Process and insert holidays
    const createdEvents = [];
    for (const holiday of holidays) {
      try {
        // Parse the date (format: "2025-01-01")
        const holidayDate = new Date(holiday.date);

        // Use localName (Indonesian name) or name (English) as title
        const title = holiday.localName || holiday.name;

        // Check if event already exists
        const { data: existing } = await repo.findMany({
          search: title,
          year: holidayDate.getFullYear(),
          month: holidayDate.getMonth() + 1,
          type: "HOLIDAY",
          limit: 1,
        });

        if (existing.length === 0) {
          const created = await repo.create({
            title: title,
            description: holiday.localName || holiday.name,
            type: "HOLIDAY",
            startDate: holidayDate,
            endDate: holidayDate,
            isPublished: true,
            createdBy: "system",
          });
          createdEvents.push(created);
        }
      } catch (error) {
        console.error("Error processing holiday:", holiday, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdEvents.length} holidays for year ${targetYear}`,
      data: createdEvents,
    });
  } catch (error) {
    console.error("Error seeding holidays:", error);
    return NextResponse.json(
      { error: "Failed to seed holidays" },
      { status: 500 }
    );
  }
}
