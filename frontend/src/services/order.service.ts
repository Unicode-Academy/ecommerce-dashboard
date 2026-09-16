import { instance } from "@/lib/axios"
import type { Order } from "@/types/order.type";

export const getOrderList = async (): Promise<Order[]> => {
    const response = await instance.get(`/orders`);
    return response.data.data;
}

export const getOrderStatusList = async () => {
    const response = await instance.get(`/orders/status`);
    return response.data.data;
}

export const updateOrderStatus = async ({ orderId, status }: { orderId: number, status: string }) => {
    const response = await instance.patch(`/orders/${orderId}/status`, {
        status
    });
    return response.data.data;
}

export const getOrder = async (orderId: number): Promise<Order> => {
    const response = await instance.get(`/orders/${orderId}`);
    return response.data.data;
}   