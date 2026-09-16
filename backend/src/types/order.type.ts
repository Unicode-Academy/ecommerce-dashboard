import { OrderStatus } from "../generated/prisma/enums"

export type OrderData = {
    customer?: {
        name: string,
        email: string,
        phone: string,
        address: string
    }
    customerId?: number,
    status: OrderStatus,
    note: string,
    details: {
        productId: number,
        quantity: number,
    }[]
}