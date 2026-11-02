import { Quote } from 'lucide-react';

interface BlockquoteProps {
  quote: string;
  name: string;
  role?: string;
  tone?: 'light' | 'dark';
}

export function Blockquote({ quote, name, role, tone = 'light' }: BlockquoteProps) {
  const dark = tone === 'dark';
  return (
    <figure className={`relative border-l-4 border-crimson pl-6 sm:pl-8 ${dark ? 'text-white' : 'text-navy'}`}>
      <Quote aria-hidden="true" className={`h-8 w-8 ${dark ? 'text-navy-200' : 'text-crimson'}`} />
      <blockquote className="mt-4 text-lg font-medium leading-relaxed sm:text-xl">
        <p>{quote}</p>
      </blockquote>
      <figcaption className={`mt-5 text-sm ${dark ? 'text-navy-100' : 'text-ink-muted'}`}>
        <span className="font-semibold">{name}</span>
        {role && <>, {role}</>}
      </figcaption>
    </figure>
  );
}
