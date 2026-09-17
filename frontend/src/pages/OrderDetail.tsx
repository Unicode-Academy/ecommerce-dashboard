import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  User,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrder,
  getOrderStatusList,
  getPaymentStatusList,
  updateNote,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/services/order.service";
import moment from "moment";
import type { Order } from "@/types/order.type";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PAYMENT_STATUS_BG,
  STATUS_BG_CLASSES,
} from "@/constants/order.constant";
import Modal from "@/components/modals/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { debounce } from "@/utils/utils";
export default function OrderDetail() {
  const { id } = useParams();
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [paymentStatusModal, setPaymentStatusModal] = useState<boolean>(false);
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(+id!),
    initialData: {} as Order,
  });
  const { data: orderStatusList } = useQuery({
    queryKey: ["order-status"],
    queryFn: getOrderStatusList,
  });
  const { data: paymentStatusList } = useQuery({
    queryKey: ["payment-status"],
    queryFn: getPaymentStatusList,
  });
  const subTotal = useMemo(
    () =>
      order.orderDetails?.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0,
      ),
    [order.orderDetails],
  );
  const quantity = useMemo(
    () => order.orderDetails?.reduce((acc, cur) => acc + cur.quantity, 0),
    [order.orderDetails],
  );
  const queryClient = useQueryClient();
  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
  });

  const paymentStatusMutation = useMutation({
    mutationFn: updatePaymentStatus,
  });

  const noteMutation = useMutation({
    mutationFn: updateNote,
  });

  return (
    <>
      <h1 className="mb-5 font-medium text-3xl">Order detail: #{id}</h1>
      <Button className="bg-[#4880FF] mb-3" size={"lg"}>
        <Link to={"/orders"}>Back order list</Link>
      </Button>
      {isLoading ? (
        <span className="block py-3">Loading...</span>
      ) : error ? (
        <span className="block py-3">Error: {error.message}</span>
      ) : (
        <>
          <div className="bg-white mb-3 p-5 rounded-lg">
            <h2 className="mb-3 font-medium text-xl">Detail basic</h2>
            <hr />
            <div className="grid grid-cols-4 py-3">
              <div>
                <span className="block">Order ID</span>
                <span className="font-medium">{id}</span>
              </div>
              <div>
                <span className="block">Order Date</span>
                <span className="font-medium">
                  {moment(order.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </span>
              </div>
              <div>
                <span className="block">Payment</span>
                <span className="font-medium">{order?.orderPayment?.name}</span>
              </div>
              <div>
                <span className="block">Order Status</span>
                <span className="font-medium">
                  <Button
                    className={cn(
                      STATUS_BG_CLASSES[order.status],
                      "cursor-pointer hover:opacity-65",
                    )}
                    onClick={() => {
                      setStatusModal(true);
                    }}
                  >
                    {order.status}
                  </Button>
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-3/4">
              <div className="bg-white mb-3 p-5 rounded-lg">
                <h2 className="mb-3 font-medium text-xl">Product Infomation</h2>
                <hr className="mb-3" />
                <Table className="bg-white p-5 rounded-lg">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-3 py-2 w-[10%]">Image</TableHead>
                      <TableHead className="px-3 py-2 w-[15%]">Name</TableHead>
                      <TableHead className="px-3 py-2 w-[15%]">Price</TableHead>
                      <TableHead className="px-3 py-2 w-[10%]">
                        Quantity
                      </TableHead>
                      <TableHead className="px-3 py-2 w-[10%]">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.orderDetails?.map((item) => (
                      <TableRow key={item.product.id}>
                        <TableCell>
                          <img
                            src={`${import.meta.env.VITE_SERVER_UPLOAD}${item.product.thumbnail}`}
                            width={70}
                          />
                        </TableCell>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.price.toLocaleString()}đ</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {(item.quantity * item.price).toLocaleString()}đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="bg-white mb-3 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-medium text-xl">Payment Status</h2>
                  <Button
                    onClick={() => setPaymentStatusModal(true)}
                    className={PAYMENT_STATUS_BG[order?.orderPayment?.status]}
                  >
                    {order?.orderPayment?.status}
                  </Button>
                </div>
                <hr className="mb-3" />
                <div className="flex mb-3">
                  <div className="w-[15%]">Sub total</div>
                  <div className="w-[15%]">{quantity} items</div>
                  <div className="flex-1 font-medium text-right">
                    {subTotal?.toLocaleString()}đ
                  </div>
                </div>
                <div className="flex mb-3">
                  <div className="w-[15%]">Shipping Charge</div>
                  <div className="w-[15%]">-</div>
                  <div className="flex-1 font-medium text-right">-</div>
                </div>
                <hr className="mb-3" />
                <div className="flex mb-3">
                  <div className="w-[15%] font-medium">Total payment</div>
                  <div className="flex-1 font-medium text-right">
                    {subTotal?.toLocaleString()}đ
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white mb-3 p-5 rounded-lg">
                <h2 className="mb-3 font-medium text-xl">
                  Customer Infomation
                </h2>
                <hr className="mb-3" />
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gray-200 p-1 border rounded-sm">
                    <User size={18} />
                  </div>
                  <div className="text-sm">
                    <span className="block">Name</span>
                    <span className="block font-medium">
                      {order.customer?.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gray-200 p-1 border rounded-sm">
                    <Mail size={18} />
                  </div>
                  <div className="text-sm">
                    <span className="block">Email</span>
                    <span className="block font-medium">
                      {" "}
                      {order.customer?.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gray-200 p-1 border rounded-sm">
                    <Phone size={18} />
                  </div>
                  <div className="text-sm">
                    <span className="block">Phone</span>
                    <span className="block font-medium">
                      {" "}
                      {order.customer?.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gray-200 p-1 border rounded-sm">
                    <MapPin size={18} />
                  </div>
                  <div className="text-sm">
                    <span className="block">Shipping Address</span>
                    <span className="block font-medium">
                      {" "}
                      {order.customer?.address}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gray-200 p-1 border rounded-sm">
                    <ReceiptText size={18} />
                  </div>
                  <div className="text-sm">
                    <span className="block">Billing Address</span>
                    <span className="block font-medium">
                      Same shipping address
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gray-200 p-1 border rounded-sm">
                    <CreditCard size={18} />
                  </div>
                  <div className="text-sm">
                    <span className="block">Payment</span>
                    <span className={cn("block font-medium")}>
                      <span
                        className={cn(
                          PAYMENT_STATUS_BG[order?.orderPayment?.status],
                          "inline-block px-2 py-1",
                        )}
                      >
                        {order?.orderPayment?.status}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white mb-3 p-5 rounded-lg">
                <h2 className="mb-3 font-medium text-xl">Note</h2>
                <hr className="mb-3" />
                <div
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: order.note }}
                  onInput={debounce((e) => {
                    const target = e.target as HTMLInputElement;
                    const note = target.innerText.trim();
                    noteMutation.mutate(
                      {
                        orderId: +id!,
                        note,
                      },
                      {
                        onSuccess: () => {
                          queryClient.invalidateQueries({
                            queryKey: ["orders", id],
                          });
                          toast.success("Update note success");
                        },
                        onError: () => {
                          toast.error("Update note failed");
                        },
                      },
                    );
                  })}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <Modal
        open={statusModal}
        onClose={() => {
          setStatusModal(false);
        }}
        title="Change Status"
      >
        <Select
          value={order.status}
          onValueChange={(status: string) => {
            statusMutation.mutate(
              {
                orderId: +id!,
                status,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["orders", id] });
                  toast.success("Change status success");
                  setStatusModal(false);
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

      <Modal
        open={paymentStatusModal}
        onClose={() => {
          setPaymentStatusModal(false);
        }}
        title="Change Payment Status"
      >
        <Select
          value={order?.orderPayment?.status}
          onValueChange={(status: string) => {
            paymentStatusMutation.mutate(
              {
                orderId: +id!,
                status,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["orders", id] });
                  toast.success("Change payment status success");
                  setPaymentStatusModal(false);
                },
                onError: () => {
                  toast.error("Change payment status failed");
                },
              },
            );
          }}
        >
          <SelectTrigger className="py-5 w-full">
            <SelectValue placeholder="Select a Status" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {paymentStatusList?.map((item: string) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Modal>
    </>
  );
}
