import type { Delta } from "quill";
import z from "zod";
export const createProductSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  price: z.coerce.number().min(1, "Giá phải lớn hơn 0"),
  salePrice: z.coerce.number().optional(),
  description: z
    .transform((value: Delta) => {
      return JSON.stringify(value.ops) === `[{"insert":"\\n"}]`
        ? ""
        : JSON.stringify(value.ops);
    })
    .pipe(z.string().min(1, "Mô tả không được để trống")),
  shortDescription: z.string().optional(),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  categoryId: z
    .transform((value) => (value === undefined ? 0 : +value!))
    .pipe(z.number().min(1, "Danh mục không được để trống")),
  images: z
    .array(z.string().min(1, "Ảnh thư viện không được để trống"))
    .optional(),
  status: z.boolean("Trạng thái không hợp lệ").optional(),
});
