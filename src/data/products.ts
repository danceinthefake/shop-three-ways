export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
};

export const PRODUCTS_URL = 'https://api.escuelajs.co/api/v1/products?limit=8&offset=0';
