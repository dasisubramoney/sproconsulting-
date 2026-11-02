import type { ReactNode } from 'react';

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
        <p className={`text-eyebrow uppercase ${dark ? 'text-navy-100' : 'text-maroon'}`} data-reveal-item>
          {eyebrow}
        </p>
      )}
      {/* data-split: rises line by line on scroll (src/motion/useSplitHeading.ts). */}
      <Heading id={id} className={`mt-3 text-h2 ${dark ? 'text-white' : 'text-navy'}`} data-split>
        {title}
      </Heading>
      {intro && (
        <div
          className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? 'text-navy-50' : 'text-ink-muted'}`}
          data-reveal-item
        >
          {intro}
        </div>
      )}
    </div>
  );
}
