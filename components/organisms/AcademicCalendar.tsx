"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { AcademicEvent } from "@/lib/types";

export function AcademicCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<AcademicEvent[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [date]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const year = date?.getFullYear() || new Date().getFullYear();
      const month = (date?.getMonth() || 0) + 1;

      const response = await fetch(`/api/calendar?year=${year}&month=${month}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (checkDate: Date) => {
    return events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const check = new Date(checkDate);

      check.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return check >= start && check <= end;
    });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const eventsOnDate = getEventsForDate(selectedDate);
      setSelectedDateEvents(eventsOnDate);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "HOLIDAY":
        return "bg-red-500";
      case "EVENT":
        return "bg-blue-500";
      case "ADMISSION":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "HOLIDAY":
        return "destructive";
      case "EVENT":
        return "default";
      case "ADMISSION":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Kalender Akademik
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            locale={localeId}
            className="rounded-md border"
            modifiers={{
              hasEvent: (date) => getEventsForDate(date).length > 0,
            }}
            modifiersClassNames={{
              hasEvent: "bg-primary/10 font-bold",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {date
              ? format(date, "dd MMMM yyyy", { locale: localeId })
              : "Pilih Tanggal"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat...</p>
          ) : selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-l-4 pl-4 py-2"
                  style={{
                    borderLeftColor: getEventTypeColor(event.type),
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <Badge variant={getEventTypeBadge(event.type) as any}>
                      {event.type}
                    </Badge>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tidak ada acara pada tanggal ini
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Agenda Mendatang</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events
              .filter((event) => new Date(event.startDate) >= new Date())
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-3 rounded-lg border"
                >
                  <div className="flex-shrink-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {format(new Date(event.startDate), "dd")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(event.startDate), "MMM", {
                          locale: localeId,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={getEventTypeBadge(event.type) as any}>
                    {event.type}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
