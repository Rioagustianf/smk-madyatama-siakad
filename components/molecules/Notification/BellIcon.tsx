"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import NotificationList from "./NotificationList";

export function BellIcon() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  // Polling for unread count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        // Query to get unread count only? Or just list and count
        // For efficiency, maybe just count. But our API returns { unreadCount }.
        const res = await fetch("/api/notifications?limit=1");
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.unreadCount);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationList
          onClose={() => setOpen(false)}
          onRead={() => setUnreadCount((prev) => Math.max(0, prev - 1))}
        />
      </PopoverContent>
    </Popover>
  );
}
