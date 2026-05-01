import { useStore } from '@nanostores/react';
import { toasts, dismissToast } from '../stores/toasts';
import ToastReact from './ToastReact';

export default function ToasterReact() {
  const list = useStore(toasts);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-72 flex-col gap-2">
      {list.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastReact variant={t.variant} onDismiss={() => dismissToast(t.id)}>
            {t.title && <strong className="block">{t.title}</strong>}
            <span>{t.message}</span>
          </ToastReact>
        </div>
      ))}
    </div>
  );
}
