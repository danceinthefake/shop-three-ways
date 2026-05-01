// Raw shape from DummyJSON. We only declare the fields we actually use,
// not the full ~20-field record the API returns.
type RawProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  images: string[];
};

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  images: string[];
};

// Fetch a wider window than we display, then sample across it. DummyJSON
// returns products grouped by category in id order — a flat ?limit=8 would
// give us eight beauty products. Stepping through ?limit=100 every 12th
// item spans ~8 categories so the demo shop looks like a general store.
const FETCH_WINDOW = 100;
const STEP = 12;
const SELECT = 'id,title,description,category,price,thumbnail,images';
export const PRODUCTS_URL = `https://dummyjson.com/products?limit=${FETCH_WINDOW}&select=${SELECT}`;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalize(p: RawProduct): Product {
  return {
    id: p.id,
    slug: slugify(p.title),
    title: p.title,
    description: p.description,
    category: p.category,
    price: p.price,
    thumbnail: p.thumbnail,
    images: p.images,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(PRODUCTS_URL);
  const data = (await res.json()) as { products: RawProduct[] };
  return data.products.filter((_, i) => i % STEP === 0).map(normalize);
}
