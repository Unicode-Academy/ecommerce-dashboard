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
export const getPaymentStatusList = async () => {
    const response = await instance.get(`/orders/payment-status`);
    return response.data.data;
}

export const updateOrderStatus = async ({ orderId, status, title, note }: { orderId: number, status: string, title: string, note: string }) => {
    const response = await instance.patch(`/orders/${orderId}/status`, {
        status,
        title,
        note
    });
    return response.data.data;
}

export const updatePaymentStatus = async ({ orderId, status }: { orderId: number, status: string }) => {
    const response = await instance.patch(`/orders/${orderId}/payment-status`, {
        status
    });
    return response.data.data;
}

export const getOrder = async (orderId: number): Promise<Order> => {
    const response = await instance.get(`/orders/${orderId}`);
    return response.data.data;
}

export const updateNote = async ({ orderId, note }: { orderId: number, note: string }) => {
    const response = await instance.patch(`/orders/${orderId}/note`, {
        note
    });
    return response.data.data;
}

export const deleteOrder = async (orderId: number) => {
    const response = await instance.delete(`/orders/${orderId}`);
    return response.data.data;
}