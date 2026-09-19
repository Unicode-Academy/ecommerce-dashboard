import { OrderStatus } from "../generated/prisma/enums"
import { prisma } from "../libs/prisma"

export const trackingService = {
    findByStatus(orderId: number, status: OrderStatus) {
        return prisma.orderTracking.findFirst({
            where: {
                orderId,
                status
            },
        })
    }
}