import { atom } from 'nanostores';

export type ToastVariant = 'info' | 'success' | 'wishlist';

export type Toast = {
  id: number;
  variant: ToastVariant;
  title?: string;
  message: string;
};

export const toasts = atom<Toast[]>([]);

const DEFAULT_TTL_MS = 2500;
let nextId = 1;

export function pushToast(input: Omit<Toast, 'id'>, ttlMs = DEFAULT_TTL_MS): number {
  const id = nextId++;
  toasts.set([...toasts.get(), { ...input, id }]);
  setTimeout(() => dismissToast(id), ttlMs);
  return id;
}

export function dismissToast(id: number): void {
  toasts.set(toasts.get().filter((t) => t.id !== id));
}
