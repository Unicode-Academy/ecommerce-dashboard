export type Category = {
  name: string;
  id: number;
  status: boolean;
};

export type SearchParams = {
  s: string;
  status: string;
  page: string;
  limit: string;
};
