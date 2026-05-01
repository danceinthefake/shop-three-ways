import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useStore } from '@nanostores/react';
import { cart } from '../stores/cart';
import { shippingOptions, effectiveShippingFee } from '../data/shipping';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputCls = 'rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none';

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'address' | 'city' | 'zip' | 'shipping', string>>;

export default function CheckoutFormReact() {
  const $cart = useStore(cart);
  const subtotal = useMemo(
    () => Object.values($cart).reduce((s, i) => s + i.price * i.qty, 0),
    [$cart],
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [shipping, setShipping] = useState('');
  const [tried, setTried] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo<Errors>(() => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = 'Name is required.';
    if (!EMAIL_RE.test(email)) e.email = 'Valid email required.';
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'At least 10 digits.';
    if (!address.trim()) e.address = 'Address is required.';
    if (!city.trim()) e.city = 'City is required.';
    if (zip.trim().length < 4) e.zip = 'Zip is required.';
    if (!shippingOptions.some((o) => o.id === shipping)) e.shipping = 'Pick a shipping method.';
    return e;
  }, [name, email, phone, address, city, zip, shipping]);

  const isValid = Object.keys(errors).length === 0;

  const selectedOption = useMemo(
    () => shippingOptions.find((o) => o.id === shipping),
    [shipping],
  );
  const shippingFee = useMemo(
    () => (selectedOption ? effectiveShippingFee(selectedOption, subtotal) : 0),
    [selectedOption, subtotal],
  );
  const total = subtotal + shippingFee;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (isValid) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-900">
        <p className="mb-1 font-semibold">Order placed (mock).</p>
        <p>Thanks {name}, shipping via {selectedOption?.name} ({selectedOption?.eta}).</p>
        <p className="mt-2 tabular-nums">Total charged: ${total.toFixed(2)}</p>
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
      <Field label="Phone" error={tried ? errors.phone : undefined}>
        <input className={inputCls} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
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

      <fieldset className="mt-2 flex flex-col gap-1">
        <legend className="text-sm text-slate-600 dark:text-slate-300">Shipping</legend>
        {shippingOptions.map((opt) => {
          const fee = effectiveShippingFee(opt, subtotal);
          const isFree = fee === 0;
          return (
            <label key={opt.id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="shipping-react"
                value={opt.id}
                checked={shipping === opt.id}
                onChange={(e) => setShipping(e.target.value)}
              />
              <span className="flex-1">
                {opt.name} <span className="text-xs text-slate-500 dark:text-slate-400">· {opt.eta}</span>
              </span>
              <span className="tabular-nums">{isFree ? 'Free' : `$${fee.toFixed(2)}`}</span>
            </label>
          );
        })}
        {tried && errors.shipping && <span className="text-xs text-red-600">{errors.shipping}</span>}
      </fieldset>

      <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-slate-200 dark:border-slate-800 pt-2 text-sm">
        <dt className="text-slate-600 dark:text-slate-300">Subtotal</dt>
        <dd className="tabular-nums">${subtotal.toFixed(2)}</dd>
        <dt className="text-slate-600 dark:text-slate-300">Shipping</dt>
        <dd className="tabular-nums">{selectedOption ? (shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`) : '—'}</dd>
        <dt className="font-semibold">Total</dt>
        <dd className="tabular-nums font-semibold">${total.toFixed(2)}</dd>
      </dl>

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
