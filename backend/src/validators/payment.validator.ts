import z from "zod";

export const createPaymentMethod = z.object({
    name: z.string({ error: "Name is required" }),
    status: z.enum(['DRAFT', 'PUBLISH'], "Status invalid: DRAFT, PUBLISH").optional()
});

export const updatePaymentMethod = z.object({
    name: z.string({ error: "Name is required" }).optional(),
    status: z.enum(['DRAFT', 'PUBLISH'], "Status invalid: DRAFT, PUBLISH").optional()
})