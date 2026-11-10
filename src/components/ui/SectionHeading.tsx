import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
  as?: 'h2' | 'h3';
  tone?: 'light' | 'dark';
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  align = 'left',
  as: Heading = 'h2',
  tone = 'light',
}: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p data-reveal-item>
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        </p>
      )}
      {/* data-split: rises line by line on scroll (src/motion/useSplitHeading.ts). */}
      <Heading id={id} className={`mt-3 text-h2 ${dark ? 'text-white' : 'text-steel-700'}`} data-split>
        {title}
      </Heading>
      {intro && (
        <div
          className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? 'text-steel-100' : 'text-steel-600'}`}
          data-reveal-item
        >
          {intro}
        </div>
      )}
    </div>
  );
}
