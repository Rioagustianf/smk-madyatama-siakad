"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export default function NotificationList({
  onClose,
  onRead,
}: {
  onClose: () => void;
  onRead: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=10");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string, link?: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      onRead();

      if (link) {
        router.push(link);
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      // Reset count in parent? onRead is simple -1, so we might need a better sync way for "All".
      // A reload or re-polling would fix it.
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div className="p-4 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col max-h-[400px]">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h4 className="font-semibold text-sm">Notifications</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={markAllRead}
          className="text-xs h-auto py-1"
        >
          Mark all read
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                  !n.isRead && "bg-blue-50/50"
                )}
                onClick={() => markRead(n.id, n.link)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
