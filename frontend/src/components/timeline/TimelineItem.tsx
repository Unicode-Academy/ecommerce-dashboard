import { cn } from "@/lib/utils";
import type { Order } from "@/types/order.type";
import { Calendar } from "lucide-react";
type TimelineItemProps = {
  order: Order;
  time: string;
  status: string;
  title: string;
  description: string;
  color?: "default" | "danger";
};
export default function TimelineItem({
  order,
  time,
  status,
  title,
  description,
  color = "default",
}: TimelineItemProps) {
  return (
    <div
      className={cn(
        "relative pb-12 last:pb-0",
        status !== order.status && "text-gray-400",
        time && "text-primary",
      )}
    >
      {/* Timeline dot */}
      <div
        className={cn(
          "top-3 left-px absolute border-2 rounded-full ring-8 ring-background w-3 h-3 -translate-x-1/2",
          order.status === status
            ? color === "danger"
              ? "bg-red-600 border-red-600"
              : "bg-[#4880FF] border-[#4880FF]"
            : "bg-background border-primary",
        )}
      />

      {/* Content */}
      <div
        className={cn(
          "space-y-3 pl-5",
          order.status === status &&
            (color === "danger" ? "text-red-600" : "text-[#4880FF]"),
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className="font-medium text-base">{status}</span>
        </div>
        <div>
          <h3 className={cn("font-medium text-xl tracking-[-0.01em]")}>
            {title}
          </h3>
          {time && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{time}</span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-sm sm:text-base text-pretty">{description}</p>
        )}
      </div>
    </div>
  );
}
