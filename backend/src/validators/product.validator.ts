import z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(1, "Price > 0"),
  salePrice: z.number().optional(),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  status: z.boolean().optional(),
  categoryId: z.number(),
  images: z.array(z.string()),
});

export const updateProductSchema = z.object({
  name: z.string({ error: "Name is string" }).optional(),
  price: z.number({ error: "Price is number" }).optional(),
  salePrice: z.number({ error: "salePrice is number" }).optional(),
  description: z.string({ error: "Description is string" }).optional(),
  shortDescription: z.string({ error: "shortDescription is string" }).optional(),
  thumbnail: z.string({ error: "Thumbnail is string" }).optional(),
  status: z.boolean().optional(),
  categoryId: z.number({ error: "Category ID is number" }).optional(),
  images: z.array(z.string()).optional(),
});
