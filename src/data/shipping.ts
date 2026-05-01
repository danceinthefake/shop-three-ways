export type ShippingOption = {
  id: string;
  name: string;
  eta: string;
  price: number;
  /** Subtotal threshold above which this option becomes free. */
  freeOver?: number;
};

export const shippingOptions: ShippingOption[] = [
  { id: 'standard', name: 'Standard', eta: '5–7 business days', price: 5, freeOver: 50 },
  { id: 'express', name: 'Express', eta: '2–3 business days', price: 15 },
  { id: 'overnight', name: 'Overnight', eta: 'Next business day', price: 35 },
];

/** Returns the effective shipping fee for an option given the cart subtotal. */
export function effectiveShippingFee(option: ShippingOption, subtotal: number): number {
  if (option.freeOver !== undefined && subtotal >= option.freeOver) return 0;
  return option.price;
}
