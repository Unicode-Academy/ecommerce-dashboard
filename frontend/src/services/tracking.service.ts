import { instance } from "@/lib/axios";

export const getTracking = async (orderId: number, status: string) => {
    const response = await instance.get(`/orders/${orderId}/tracking?status=${status}`);
    return response.data.data;
}