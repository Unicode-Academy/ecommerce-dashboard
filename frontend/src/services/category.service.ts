import { instance } from "@/lib/axios";
import type { Category, SearchParams } from "@/types/category.type";

export const getCategories = async (
  filters: SearchParams,
): Promise<{ data: Category[]; totalPage: number }> => {
  if (["publish", "draft"].includes(filters.status)) {
    filters.status = filters.status === "publish" ? "true" : "false";
  }
  const response = await instance.get(
    `/categories?${new URLSearchParams({ ...filters, limit: 20 } as unknown as SearchParams)}`,
  );
  const { total, limit } = response.data.meta;
  const totalPage = Math.ceil(total / limit);

  return {
    data: response.data.data,
    totalPage,
  };
};

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await instance.get(`/categories?limit=-1`);
  return response.data.data;
};

export const deleteCategory = (id: number) => {
  return instance.delete(`/categories/${id}`);
};

export const createCategory = (newCategory: Partial<Category>) => {
  return instance.post("/categories", newCategory);
};

export const updateCategory =
  (id: number) => (newCategory: Partial<Category>) => {
    return instance.put(`/categories/${id}`, newCategory);
  };
