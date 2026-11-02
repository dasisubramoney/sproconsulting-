/**
 * Client-side validation for the contact form. This is a usability aid only —
 * Netlify Forms (plus the honeypot) is the server-side gate.
 */

export interface ContactValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  consent: boolean;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const limits = {
  name: 100,
  email: 254,
  phone: 30,
  company: 120,
  messageMin: 10,
  message: 2000,
} as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s-]{7,}$/;

export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = v.name.trim();
  const email = v.email.trim();
  const phone = v.phone.trim();
  const message = v.message.trim();

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > limits.name) errors.name = `Name must be ${limits.name} characters or fewer.`;

  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > limits.email || !EMAIL.test(email))
    errors.email = 'Please enter a valid email address, like name@company.co.za.';

  if (phone && (phone.length > limits.phone || !PHONE.test(phone)))
    errors.phone = 'Please enter a valid phone number, or leave this blank.';

  if (v.company.trim().length > limits.company)
    errors.company = `Company must be ${limits.company} characters or fewer.`;

  if (!message) errors.message = 'Please tell us about your project.';
  else if (message.length < limits.messageMin)
    errors.message = `Please write at least ${limits.messageMin} characters.`;
  else if (message.length > limits.message)
    errors.message = `Message must be ${limits.message} characters or fewer.`;

  if (!v.consent) errors.consent = 'Please confirm you agree to the privacy notice so we can reply.';

  return errors;
}
