import { useEffect, useState } from 'react';
import { company } from '@/content/company';

interface ObfuscatedEmailProps {
  className?: string;
}

/**
 * Renders the contact email only after mount, assembled from parts,
 * so it never appears as a plain string in the HTML.
 */
export function ObfuscatedEmail({ className }: ObfuscatedEmailProps) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const { user, domain } = company.contact.email;
    setAddress([user, domain].join(String.fromCharCode(64)));
  }, []);

  if (!address) return <span className={className}>Email loading…</span>;
  return (
    <a href={`mailto:${address}`} className={className}>
      {address}
    </a>
  );
}
