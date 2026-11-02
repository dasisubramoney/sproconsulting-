import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import { CircleAlert, CircleCheck, LoaderCircle, Send } from 'lucide-react';
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
      <div ref={successRef} tabIndex={-1} role="status" className="border-l-4 border-navy bg-navy-50 p-8 outline-none">
        <CircleCheck aria-hidden="true" className="h-8 w-8 text-navy" />
        <h2 className="mt-4 text-h3 text-navy">Thank you — your message has been sent.</h2>
        <p className="mt-2 text-ink-muted">One of our engineers will get back to you shortly.</p>
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

      <p id="form-required-note" className="text-sm text-ink-muted">
        Fields marked <span aria-hidden="true" className="text-crimson">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Full name" required error={errors.name}>
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
        <Field id="email" label="Email address" required error={errors.email}>
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
        <Field id="phone" label="Phone number" error={errors.phone}>
          <input
            {...inputProps('phone', errors.phone)}
            type="tel"
            autoComplete="tel"
            maxLength={limits.phone}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </Field>
        <Field id="company" label="Company" error={errors.company}>
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

      <Field id="service" label="Service of interest">
        <select {...inputProps('service')} value={values.service} onChange={(e) => set('service', e.target.value)}>
          <option value="">Not sure / general enquiry</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Sustainable Innovation">Sustainable Innovation (water &amp; energy)</option>
        </select>
      </Field>

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
            className="mt-1 h-5 w-5 shrink-0 accent-navy"
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-ink">
            I agree that {company.shortName} may use these details to respond to my enquiry, as described in the{' '}
            <Link to="/privacy" className="font-semibold text-navy underline hover:text-crimson">
              privacy notice
            </Link>
            . <span aria-hidden="true" className="text-crimson">*</span>
          </label>
        </div>
        {errors.consent && <ErrorText id="consent-error">{errors.consent}</ErrorText>}
      </div>

      {status === 'error' && (
        <div role="alert" className="flex gap-3 border-l-4 border-crimson bg-crimson-50 p-4 text-sm text-ink">
          <CircleAlert aria-hidden="true" className="h-5 w-5 shrink-0 text-crimson-700" />
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
        className="btn-primary aria-disabled:cursor-wait aria-disabled:opacity-60"
        aria-disabled={submitting || undefined}
      >
        {submitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send aria-hidden="true" className="h-4 w-4" /> Send message
          </>
        )}
      </button>
    </form>
  );
}

function inputProps(name: keyof ContactValues, error?: string, isTextarea = false) {
  const describedBy = [error ? `${name}-error` : null, name === 'message' ? 'message-hint' : null]
    .filter(Boolean)
    .join(' ');
  return {
    id: name,
    name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
    className: `block w-full rounded-sm border bg-white px-3 py-2.5 text-ink ${isTextarea ? '' : 'min-h-11'} ${
      error ? 'border-crimson-700' : 'border-navy-200 focus:border-navy'
    }`,
  };
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
        {required && (
          <>
            {' '}
            <span aria-hidden="true" className="text-crimson">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-right text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-crimson-700">
      <CircleAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}
