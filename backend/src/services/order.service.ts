import { NotFoundException } from "../exceptions/NotFoundException";
import { OrderStatus, PaymentStatus } from "../generated/prisma/enums";
import { prisma } from "../libs/prisma"
import { OrderData } from "../types/order.type"
import { productService } from "./product.service";

export const orderService = {
    async findAll() {
        const orders = await prisma.order.findMany({
            include: {
                orderDetails: true
            }
        });

        return orders.map(order => {
            const customer = JSON.parse(order.customer as string);
            return {
                ...order,
                customer
            }
        })
    },
    async create({ details, paymentMethod, customer, ...data }: OrderData) {
        const customerJson = JSON.stringify(customer);
        const amounts = await Promise.all(details.map(async (detail) => {
            const product = await productService.find(detail.productId);
            return product.price * detail.quantity;
        }));
        const total = amounts.reduce((acc, cur) => acc + cur, 0);
        return prisma.order.create({
            data: {
                ...data,
                total,
                customer: customerJson,
                orderDetails: {
                    createMany: {
                        data: await Promise.all(details.map(async (detail) => {
                            const product = await productService.find(detail.productId);

                            return {
                                ...detail,
                                price: product.price,
                                productMeta: JSON.stringify({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    salePrice: product.salePrice,
                                    thumbnail: product.thumbnail
                                })
                            }
                        }))
                    }
                },
                orderPayment: {
                    create: {
                        paymentMethodId: paymentMethod
                    }
                }
            }
        })

    },

    async updateStatus(orderId: number, status: OrderStatus) {
        return prisma.order.update({
            where: { id: orderId },
            data: { status }
        })
    },

    async find(id: number) {
        const order = await prisma.order.findUnique({
            where: {
                id
            },
            include: {
                orderDetails: true,
                orderPayment: {
                    include: {
                        paymentMethod: true
                    }
                }
            }
        });
        if (!order) {
            throw new NotFoundException("Order not found");
        }

        const customer = JSON.parse(order.customer as string);
        const { paymentMethod, ...orderPayment } = order.orderPayment[0]!;
        return {
            ...order,
            orderDetails: order.orderDetails.map(({ productMeta, ...item }) => {
                const product = JSON.parse(productMeta as string);
                return {
                    ...item,
                    product
                }
            }),
            customer,
            orderPayment: {
                ...orderPayment,
                name: paymentMethod.name
            }
        };
    },

    async updateOrderStatus(orderId: number, status: PaymentStatus) {
        return prisma.orderPayment.update({
            where: {
                orderId
            },
            data: {
                status
            }
        })
    },

    async updateNote(orderId: number, note: string) {
        return prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                note
            }
        })
    }
}