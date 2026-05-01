import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { theme, toggleTheme } from '../stores/theme';

export default function ThemeToggle() {
  const current = useStore(theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', current === 'dark');
  }, [current]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-full border border-slate-200 bg-white px-2 py-1 text-sm leading-none hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      <span aria-hidden="true">{current === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}
