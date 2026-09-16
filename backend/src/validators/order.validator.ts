import z from "zod";

export const createOrderSchema = z.object({
    customer: z.object({
        name: z.string({ error: "Customer name is required" }),
        email: z.string({ error: "Customer email is required" }).pipe(z.email("Customer email invalid")),
        phone: z.string({ error: "Customer phone is required" }).regex(/^(0|\+84)\d{9}$/, "Customer phone invalid"),
        address: z.string({ error: "Customer address is required" })
    }).optional(),
    customerId: z.number({ error: "Customer ID invalid" }).optional(),
    status: z.enum(['PENDING', 'PROCESSING', 'ON_HOLD', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REFUNDED'], "Status invalid: PENDING, PROCESSING, ON_HOLD, SHIPPED,COMPLETED, CANCELLED, REFUNDED").optional(),
    note: z.string({ error: "Note invalid" }).optional(),
    details: z.array(z.object({
        productId: z.number({ error: "productId is required" }),
        quantity: z.number({
            error: "quantity is required"
        })
    }), "Order detail is array").min(1)
}).refine(({ customer, customerId }) => {
    if (!customer && !customerId) {
        return false;
    }
    return true;
}, {
    message: "Either 'customer' or 'customerId' must be provided.",
    path: ["customer"]
})