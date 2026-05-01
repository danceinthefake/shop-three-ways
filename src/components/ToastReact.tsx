import type { ReactNode } from 'react';
import type { ToastVariant } from '../stores/toasts';

type Props = {
  variant?: ToastVariant;
  onDismiss?: () => void;
  children: ReactNode;
};

const variantClasses: Record<ToastVariant, string> = {
  info: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  wishlist: 'border-rose-200 bg-rose-50 text-rose-900',
};

export default function ToastReact({ variant = 'info', onDismiss, children }: Props) {
  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-md border px-3 py-2 text-sm shadow-md ${variantClasses[variant]}`}
    >
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          ✕
        </button>
      )}
    </div>
  );
}
