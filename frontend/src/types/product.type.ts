export type Product<T = string[]> = {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  status: boolean;
  description: string;
  shortDescription: string;
  thumbnail: string;
  categoryId: number;
  category: {
    name: string;
    id: number;
  };
  images: T;
};
