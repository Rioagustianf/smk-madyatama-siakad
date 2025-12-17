import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  title: string;
  description?: string;
  type: string;
  onClick?: () => void;
}

const getEventColor = (type: string) => {
  switch (type) {
    case "HOLIDAY":
      return "bg-red-100 border-red-300 text-red-800 hover:bg-red-200";
    case "EVENT":
      return "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200";
    case "ADMISSION":
      return "bg-green-100 border-green-300 text-green-800 hover:bg-green-200";
    default:
      return "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200";
  }
};

export function EventCard({
  title,
  description,
  type,
  onClick,
}: EventCardProps) {
  return (
    <div
      className={`text-xs p-1.5 rounded border cursor-pointer transition-colors ${getEventColor(
        type
      )}`}
      onClick={onClick}
    >
      <div className="font-medium truncate">{title}</div>
      {description && (
        <div className="text-[10px] opacity-75 truncate">{description}</div>
      )}
    </div>
  );
}
