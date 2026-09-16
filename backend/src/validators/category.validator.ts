import z from "zod";
export const crateCategorySchema = z.object({
  name: z.string().min(1, "Category is required").prefault(""),
  status: z.boolean("Trạng thái không hợp lệ").optional(),
});
