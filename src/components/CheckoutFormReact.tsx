import { useMemo, useState, type FormEvent, type ReactNode } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputCls = 'rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none';

type Errors = Partial<Record<'name' | 'email' | 'address' | 'city' | 'zip', string>>;

export default function CheckoutFormReact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [tried, setTried] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo<Errors>(() => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = 'Name is required.';
    if (!EMAIL_RE.test(email)) e.email = 'Valid email required.';
    if (!address.trim()) e.address = 'Address is required.';
    if (!city.trim()) e.city = 'City is required.';
    if (zip.trim().length < 4) e.zip = 'Zip is required.';
    return e;
  }, [name, email, address, city, zip]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (isValid) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-900">
        Order placed (mock). Thanks, {name}.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
      <Field label="Name" error={tried ? errors.name : undefined}>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Email" error={tried ? errors.email : undefined}>
        <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Address" error={tried ? errors.address : undefined}>
        <input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="City" error={tried ? errors.city : undefined}>
          <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
        <Field label="Zip" error={tried ? errors.zip : undefined}>
          <input className={inputCls} value={zip} onChange={(e) => setZip(e.target.value)} />
        </Field>
      </div>
      <button
        type="submit"
        className="mt-2 self-start rounded bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
        disabled={tried && !isValid}
      >
        Place order
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
