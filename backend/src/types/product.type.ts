export type ProductData = {
  name: string;
  price: number;
  salePrice: number;
  status: boolean;
  description: string;
  shortDescription: string;
  thumbnail: string;
  categoryId: number;
  images: string[];
};

export type ProductQuery = {
  status: string;
  s: string;
  category: string;
  page: number;
  limit: number;
};
