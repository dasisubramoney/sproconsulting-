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
    <figure className={`relative border-l-4 border-copper-500 pl-6 sm:pl-8 ${dark ? 'text-white' : 'text-steel-700'}`}>
      <Quote aria-hidden="true" className={`h-8 w-8 ${dark ? 'text-copper-300' : 'text-copper-500'}`} />
      <blockquote className="mt-4 text-lg font-medium leading-relaxed sm:text-xl">
        <p>{quote}</p>
      </blockquote>
      <figcaption className={`mt-5 text-sm ${dark ? 'text-steel-200' : 'text-steel-600'}`}>
        <span className="font-semibold">{name}</span>
        {role && <>, {role}</>}
      </figcaption>
    </figure>
  );
}
