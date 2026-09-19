import { cn } from "@/lib/utils";
import type { Order } from "@/types/order.type";
import { Calendar } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

const timelineData = [
  {
    status: "PENDING",
    title: "Đơn hàng mới",
    description: "",
    time: "",
  },
  {
    status: "PROCESSING",
    title: "Đang xử lý",
    description: "",
    time: "",
  },
  {
    status: "SHIPPED",
    title: "Đang vận chuyển",
    description: "",
    time: "",
  },
  {
    status: "COMPLETED",
    title: "Hoàn thành",
    description: "",
    time: "",
  },
];
type TimelineProps = {
  order: Order;
};
export default function Timeline({ order }: TimelineProps) {
  const [timeline, setTimeline] = useState(timelineData);
  useEffect(() => {
    const combindTimeline = () => {
      setTimeline(
        timeline.map((item) => {
          const tracking = order.tracking?.find(
            (val) => val.status === item.status,
          );
          if (item.status === tracking?.status) {
            return {
              status: tracking.status,
              title: `${item.title}${tracking.title ? ":" + tracking.title : ""}`,
              description: tracking.note,
              time: moment(tracking.createdAt).format("DD/MM/YYYY HH:mm:ss"),
            };
          }

          return {
            ...item,
          };
        }),
      );
    };
    combindTimeline();
  }, [order.tracking]);

  return (
    <div className="bg-white px-3 py-5">
      <h2 className="mb-3 font-medium text-xl">Timeline</h2>
      <hr className="mb-3" />
      <div className="relative ml-3">
        {/* Timeline line */}
        <div className="top-4 bottom-0 left-0 absolute border-l-2" />

        {timeline.map(({ status, description, title, time }, index) => (
          <div
            className={cn(
              "relative pb-12 last:pb-0",
              status !== order.status && "text-gray-400",
              time && "text-primary",
            )}
            key={index}
          >
            {/* Timeline dot */}
            <div
              className={cn(
                "top-3 left-px absolute border-2 rounded-full ring-8 ring-background w-3 h-3 -translate-x-1/2",
                order.status === status
                  ? "bg-[#4880FF] border-[#4880FF]"
                  : "bg-background border-primary",
              )}
            />

            {/* Content */}
            <div
              className={cn(
                "space-y-3 pl-5",
                order.status === status && "text-[#4880FF]",
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
                <p className="text-muted-foreground text-sm sm:text-base text-pretty">
                  {description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
