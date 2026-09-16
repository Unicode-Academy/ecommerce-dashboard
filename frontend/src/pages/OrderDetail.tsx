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
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/services/order.service";
import moment from "moment";
import type { Order } from "@/types/order.type";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { STATUS_BG_CLASSES } from "@/constants/order.constant";
export default function OrderDetail() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(+id!),
    initialData: {} as Order,
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
                <span className="font-medium">-</span>
              </div>
              <div>
                <span className="block">Order Status</span>
                <span className="font-medium">
                  <Button
                    className={cn(
                      STATUS_BG_CLASSES[order.status],
                      "cursor-pointer hover:opacity-65",
                    )}
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
                      <TableRow>
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
                  <Button variant={"destructive"}>Not paid</Button>
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
                    <User />
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
                    <Mail />
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
                    <Phone />
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
                    <MapPin />
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
                    <ReceiptText />
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
                    <CreditCard />
                  </div>
                  <div className="text-sm">
                    <span className="block">Payment</span>
                    <span className="block font-medium">-</span>
                  </div>
                </div>
              </div>
              <div className="bg-white mb-3 p-5 rounded-lg">
                <h2 className="mb-3 font-medium text-xl">Note</h2>
                <hr className="mb-3" />
                <p>{order.note}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
