import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { AcademicEvent } from "@/lib/types";

interface EventDetailModalProps {
  event: AcademicEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case "HOLIDAY":
      return "Hari Libur";
    case "EVENT":
      return "Event";
    case "ADMISSION":
      return "Penerimaan";
    default:
      return type;
  }
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "HOLIDAY":
      return "bg-red-100 text-red-800 border-red-300";
    case "EVENT":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "ADMISSION":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export function EventDetailModal({
  event,
  open,
  onOpenChange,
}: EventDetailModalProps) {
  if (!event) return null;

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isSameDay =
    format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Event Type Badge */}
          <div>
            <Badge className={`${getEventTypeColor(event.type)} border`}>
              {getEventTypeLabel(event.type)}
            </Badge>
          </div>

          {/* Date Range */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Tanggal</p>
              {isSameDay ? (
                <p className="text-sm text-gray-900">
                  {format(startDate, "EEEE, dd MMMM yyyy", {
                    locale: localeId,
                  })}
                </p>
              ) : (
                <p className="text-sm text-gray-900">
                  {format(startDate, "dd MMMM yyyy", { locale: localeId })} -{" "}
                  {format(endDate, "dd MMMM yyyy", { locale: localeId })}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </p>
              <p className="text-sm text-gray-900 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              Informasi ini bersifat resmi dan dapat berubah sewaktu-waktu
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
