import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  Building2,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Leaf,
  LoaderCircle,
  Mail,
  Phone,
  User,
  type LucideIcon,
} from 'lucide-react';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { services } from '@/content/services';
import { company } from '@/content/company';
import { limits, validateContact, type ContactErrors, type ContactValues } from './validation';

/** Must match the hidden static form in index.html. */
const FORM_NAME = 'contact';

const initialValues: ContactValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  message: '',
  consent: false,
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const tileIcon = 'h-5 w-5 shrink-0';

/** Radio tiles for "What can we help with?". Values are what Netlify receives. */
const serviceOptions: { value: string; label: string; icon: ReactNode }[] = [
  ...services.map((s) => ({ value: s.title, label: s.title, icon: <ServiceIcon icon={s.icon} className={tileIcon} /> })),
  {
    value: 'Sustainable Innovation',
    label: 'Water & energy',
    icon: <Leaf aria-hidden="true" strokeWidth={1.75} className={tileIcon} />,
  },
  { value: '', label: 'Not sure yet', icon: <CircleHelp aria-hidden="true" strokeWidth={1.75} className={tileIcon} /> },
];

// Order used to focus the first invalid field.
const fieldOrder: (keyof ContactValues)[] = ['name', 'email', 'phone', 'company', 'service', 'message', 'consent'];

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Without JS the browser validates natively (required/type attributes) and the form
  // posts straight to Netlify. Once JS runs, switch to our accessible inline errors.
  // Set imperatively: React does not patch attributes when hydrating pre-rendered HTML.
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, [status]);

  const set = <K extends keyof ContactValues>(key: K, value: ContactValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = fieldOrder.find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus('submitting');
    const honeypot = new FormData(e.currentTarget).get('bot-field');
    const body = new URLSearchParams({
      'form-name': FORM_NAME,
      'bot-field': typeof honeypot === 'string' ? honeypot : '',
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      company: values.company.trim(),
      service: values.service,
      message: values.message.trim(),
      consent: 'yes',
    });

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      setValues(initialValues);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border-l-4 border-copper-500 bg-copper-50 p-8 outline-none">
        <CircleCheck aria-hidden="true" className="h-8 w-8 text-copper-700" />
        <h2 className="mt-4 text-h3 text-steel-700">Thank you — your message has been sent.</h2>
        <p className="mt-2 text-steel-600">One of our engineers will get back to you shortly.</p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-secondary mt-6">
          Send another message
        </button>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form
      ref={formRef}
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      aria-describedby="form-required-note"
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <p className="hidden" aria-hidden="true">
        <label>
          Leave this field empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <p id="form-required-note" className="text-sm text-steel-600">
        Fields marked <span aria-hidden="true" className="text-copper-700">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" icon={User} label="Full name" required error={errors.name}>
          <input
            {...inputProps('name', errors.name)}
            type="text"
            required
            autoComplete="name"
            maxLength={limits.name}
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </Field>
        <Field id="email" icon={Mail} label="Email address" required error={errors.email}>
          <input
            {...inputProps('email', errors.email)}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={limits.email}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>
        <Field id="phone" icon={Phone} label="Phone number" error={errors.phone}>
          <input
            {...inputProps('phone', errors.phone)}
            type="tel"
            autoComplete="tel"
            maxLength={limits.phone}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </Field>
        <Field id="company" icon={Building2} label="Company" error={errors.company}>
          <input
            {...inputProps('company', errors.company)}
            type="text"
            autoComplete="organization"
            maxLength={limits.company}
            value={values.company}
            onChange={(e) => set('company', e.target.value)}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-3 block text-sm font-semibold text-steel-700">What can we help with?</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {serviceOptions.map((option, i) => (
            <label
              key={option.value || 'general'}
              // The last tile ("Not sure yet") takes a full row, so the grid never leaves an orphan.
              className={`relative block cursor-pointer ${i === serviceOptions.length - 1 ? 'col-span-2 sm:col-span-3' : ''}`}
            >
              <input
                type="radio"
                name="service"
                value={option.value}
                checked={values.service === option.value}
                onChange={() => set('service', option.value)}
                className="peer sr-only"
              />
              <span
                className="flex h-full min-h-11 items-center gap-2.5 rounded-sm border border-steel-300 bg-white px-3 py-3 text-sm font-semibold text-steel-700
                  transition-colors duration-200 ease-brand hover:border-steel-400 hover:bg-steel-50
                  peer-checked:border-copper-700 peer-checked:bg-copper-50 peer-checked:text-ink
                  peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-copper-500
                  [&>svg]:text-steel-500 peer-checked:[&>svg]:text-copper-700"
              >
                {option.icon}
                <span className="leading-tight">{option.label}</span>
              </span>
              {/* Checked marker: a copper corner, echoing the card decor. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-0 w-0 border-l-[14px] border-t-[14px] border-l-transparent border-t-copper-700 opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        id="message"
        label="Tell us about your project"
        required
        error={errors.message}
        hint={`${values.message.length} / ${limits.message} characters`}
      >
        <textarea
          {...inputProps('message', errors.message, true)}
          rows={6}
          required
          minLength={limits.messageMin}
          maxLength={limits.message}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
        />
      </Field>

      <div>
        <div className="flex gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={values.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            className="mt-1 h-5 w-5 shrink-0 accent-copper-700"
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-ink">
            I agree that {company.shortName} may use these details to respond to my enquiry, as described in the{' '}
            <Link to="/privacy" className="font-semibold text-steel-700 underline hover:text-copper-800">
              privacy notice
            </Link>
            . <span aria-hidden="true" className="text-copper-700">*</span>
          </label>
        </div>
        {errors.consent && <ErrorText id="consent-error">{errors.consent}</ErrorText>}
      </div>

      {status === 'error' && (
        <div role="alert" className="flex gap-3 border-l-4 border-error bg-error-50 p-4 text-sm text-ink">
          <CircleAlert aria-hidden="true" className="h-5 w-5 shrink-0 text-error" />
          <p>
            Sorry, your message could not be sent. Please try again, or call us on{' '}
            <a href={`tel:${company.contact.phoneE164}`} className="font-semibold underline">
              {company.contact.phoneDisplay}
            </a>
            .
          </p>
        </div>
      )}

      {/* aria-disabled, not disabled: a disabled button drops keyboard focus to <body>. */}
      <button
        type="submit"
        className="btn-primary w-full px-8 text-base sm:w-auto aria-disabled:cursor-wait aria-disabled:opacity-60"
        aria-disabled={submitting || undefined}
      >
        {submitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

function inputProps(name: keyof ContactValues, error?: string, isTextarea = false, hasIcon = !isTextarea) {
  const describedBy = [error ? `${name}-error` : null, name === 'message' ? 'message-hint' : null]
    .filter(Boolean)
    .join(' ');
  return {
    id: name,
    name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
    className: `field peer ${isTextarea ? 'resize-y' : 'min-h-12'} ${hasIcon ? 'pl-11' : ''}`,
  };
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  /** Decorative icon shown inside the field, on the left. */
  icon?: LucideIcon;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-steel-700">
        {label}
        {required && (
          <>
            {' '}
            <span aria-hidden="true" className="text-copper-700">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </label>
      {Icon ? (
        <div className="relative">
          {children}
          <Icon
            aria-hidden="true"
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-steel-500 transition-colors duration-200 peer-focus:text-copper-700"
          />
        </div>
      ) : (
        children
      )}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-right text-xs text-steel-600">
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-error">
      <CircleAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}
