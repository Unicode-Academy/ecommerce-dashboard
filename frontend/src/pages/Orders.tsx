import moment from "moment";
import Modal from "@/components/modals/Modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUS_BG_CLASSES } from "@/constants/order.constant";
import { cn } from "@/lib/utils";
import {
  getOrderList,
  getOrderStatusList,
  updateOrderStatus,
} from "@/services/order.service";
import type { Customer } from "@/types/order.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
export default function Orders() {
  const [customerModal, setCustomerModal] = useState<boolean>(false);
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [customerDetail, setCustomerDetail] = useState({} as Customer);
  const [orderStatus, setOrderStatus] = useState<{
    orderId: number;
    status: string;
  }>({
    orderId: 0,
    status: "PENDING",
  });
  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrderList,
    initialData: [],
  });

  const { data: orderStatusList } = useQuery({
    queryKey: ["order-status"],
    queryFn: getOrderStatusList,
  });

  const queryClient = useQueryClient();
  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
  });

  return (
    <>
      <h1 className="mb-5 font-medium text-3xl">Orders</h1>
      <Button className="bg-[#4880FF] mb-3" size={"lg"}>
        <Link to={""}>Thêm mới</Link>
      </Button>
      {isLoading ? (
        <span className="block py-3">Loading...</span>
      ) : error ? (
        <span className="block py-3">Error: {error.message}</span>
      ) : (
        <Table className="bg-white p-5 rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="px-3 py-2 w-[5%]">ID</TableHead>
              <TableHead className="px-3 py-2 w-[15%]">Customer</TableHead>
              <TableHead className="px-3 py-2 w-[15%]">Total</TableHead>
              <TableHead className="px-3 py-2 w-[10%]">Status</TableHead>
              <TableHead className="px-3 py-2">Note</TableHead>
              <TableHead className="px-3 py-2 w-[10%]">Date</TableHead>
              <TableHead className="w-[10%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              return (
                <TableRow key={order.id}>
                  <TableCell className="px-3 py-2">#{order.id}</TableCell>
                  <TableCell className="px-3 py-2">
                    <div className="mb-1">
                      Name: {order.customer.name} <br />
                      Phone: {order.customer.phone}
                    </div>
                    <Button
                      className="bg-[#4880FF] hover:bg-[rgba(72,127,255,0.65)] text-white cursor-pointer"
                      size={"icon-xs"}
                      onClick={() => {
                        setCustomerModal(true);
                        setCustomerDetail(order.customer);
                      }}
                    >
                      <Eye />
                    </Button>
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    {order.total.toLocaleString()}đ
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    <Button
                      className={cn(
                        STATUS_BG_CLASSES[order.status],
                        "cursor-pointer hover:opacity-65",
                      )}
                      onClick={() => {
                        setStatusModal(true);
                        setOrderStatus({
                          orderId: order.id,
                          status: order.status,
                        });
                      }}
                    >
                      {order.status}
                    </Button>
                  </TableCell>
                  <TableCell className="px-3 py-2">{order.note}</TableCell>
                  <TableCell className="px-3 py-2">
                    {moment(order.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-1 px-3 py-2 h-full">
                      <Button
                        className="bg-[#4880FF] hover:bg-[rgba(72,127,255,0.65)] text-white cursor-pointer"
                        asChild
                      >
                        <Link to={`/orders/${order.id}`}>
                          <Eye />
                        </Link>
                      </Button>
                      <Button
                        variant={"destructive"}
                        className="cursor-pointer"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <Modal
        open={customerModal}
        onClose={() => {
          setCustomerModal(false);
          setCustomerDetail({} as Customer);
        }}
        title="Customer detail"
      >
        <p className="py-2">Name: {customerDetail.name}</p>
        <p className="py-2">Email: {customerDetail.email}</p>
        <p className="py-2">Phone: {customerDetail.phone}</p>
        <p className="py-2">Address: {customerDetail.address}</p>
      </Modal>

      <Modal
        open={statusModal}
        onClose={() => {
          setStatusModal(false);
        }}
        title="Change Status"
      >
        <Select
          value={orderStatus.status}
          onValueChange={(status: string) => {
            const { orderId } = orderStatus;
            statusMutation.mutate(
              {
                orderId,
                status,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["orders"] });
                  toast.success("Change status success");
                  setStatusModal(false);
                  setOrderStatus({
                    orderId: 0,
                    status: "PENDING",
                  });
                },
                onError: () => {
                  toast.error("Change status failed");
                },
              },
            );
          }}
        >
          <SelectTrigger className="py-5 w-full">
            <SelectValue placeholder="Select a Status" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {orderStatusList?.map((item: string) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Modal>
    </>
  );
}
