export type Promo = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

export const promos: Promo[] = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 40% off seasonal favorites.',
    image: 'https://picsum.photos/seed/promo1/640/320',
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Fresh picks every week.',
    image: 'https://picsum.photos/seed/promo2/640/320',
  },
  {
    id: 3,
    title: 'Free Shipping',
    subtitle: 'On every order over $50.',
    image: 'https://picsum.photos/seed/promo3/640/320',
  },
];

export const SLIDE_INTERVAL_MS = 3000;
