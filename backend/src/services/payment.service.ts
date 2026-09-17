import { prisma } from "../libs/prisma"
import { PaymentMethodData } from "../types/payment.type";

export const paymentService = {
    getListMethod() {
        return prisma.paymentMethod.findMany();
    },

    createMethod(data: PaymentMethodData) {
        return prisma.paymentMethod.create({
            data
        })
    },
    updateMethod(data: PaymentMethodData, id: number) {
        return prisma.paymentMethod.update({
            where: { id },
            data
        })
    },
    deleteMethod(id: number) {
        return prisma.paymentMethod.delete({
            where: { id }
        })
    }
}