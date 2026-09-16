import { instance } from "@/lib/axios";
import type { SearchParams } from "@/types/category.type";
import type { Product } from "@/types/product.type";

export const createProduct = (newProduct: Partial<Product>) => {
  return instance.post("/products", {
    ...newProduct,
    images: !newProduct.images ? [] : newProduct.images,
  });
};

export const updateProduct = (id: number, productData: Partial<Product>) => {
  return instance.patch("/products/" + id, {
    ...productData,
    images: !productData.images ? [] : productData.images,
  });
};

export const getProducts = async (filters: SearchParams): Promise<{ data: Product[]; totalPage: number }> => {
  if (["publish", "draft"].includes(filters.status)) {
    filters.status = filters.status === "publish" ? "true" : "false";
  }
  const response = await instance.get(`/products?${new URLSearchParams({ ...filters, limit: 20 } as unknown as SearchParams)}`);

  const { total, limit } = response.data.meta;
  const totalPage = Math.ceil(total / limit);

  return {
    data: response.data.data,
    totalPage,
  };
};

export const getProduct = async (id: number): Promise<Product<{ image: string }[]>> => {
  const response = await instance.get(`/products/${id}`);
  return response.data.data;
};

export const deleteProduct = async (id: number) => {
  return instance.delete(`/products/${id}`);
}
