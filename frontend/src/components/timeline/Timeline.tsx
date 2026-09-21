import type { Order } from "@/types/order.type";
import moment from "moment";
import { useEffect, useState } from "react";
import TimelineItem from "./TimelineItem";

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
  const currentTracking = order?.tracking?.find(
    (val) => val.status === order.status,
  );
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
              title: `${item.title}${tracking.title ? ": " + tracking.title : ""}`,
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

        {timeline.map((item, index) => {
          if (!item.time) {
            if (
              order.status === "ON_HOLD" ||
              order.status === "CANCELLED" ||
              order.status === "REFUNDED"
            ) {
              return;
            }
          }
          return <TimelineItem order={order} key={index} {...item} />;
        })}
        {(order.status === "ON_HOLD" ||
          order.status === "CANCELLED" ||
          order.status === "REFUNDED") && (
          <TimelineItem
            color="danger"
            order={order}
            status={order.status}
            time={moment(currentTracking?.createdAt).format(
              "DD/MM/YYYY HH:mm:ss",
            )}
            title={currentTracking?.title as string}
            description={currentTracking?.note as string}
          />
        )}
      </div>
    </div>
  );
}
