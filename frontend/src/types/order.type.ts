import type { Product } from "./product.type";

export type Customer = {
    name: string;
    email: string;
    phone: string;
    address: string;
}
export type Order = {
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string
    };
    id: number;
    total: number;
    status: "PENDING" | "PROCESSING" | "ON_HOLD" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "REFUNDED",
    note: string;
    createdAt: Date;
    orderDetails?: {
        price: number;
        quantity: number;
        product: Product
    }[]
}