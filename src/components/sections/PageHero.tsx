import type { ReactNode } from 'react';
import { SlashBands } from '@/components/ui/SlashBands';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}

/** Standard interior-page header with the diagonal slash motif. */
export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy text-white">
      {/* Beside the text from xl up; a strip below the text on smaller screens. */}
      <SlashBands region="-z-10 inset-y-0 right-0 hidden w-[34%] xl:block" intro />
      <SlashBands region="-z-10 inset-x-0 bottom-0 h-20 xl:hidden" size="sm" intro />
      <div className="container-page pb-28 pt-16 sm:pt-20 xl:py-24">
        {eyebrow && (
          <p className="text-eyebrow uppercase text-navy-100" data-reveal>
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-h1" data-reveal="1">
          {title}
        </h1>
        {intro && (
          <div className="mt-5 max-w-prose text-base leading-relaxed text-navy-50 sm:text-lg" data-reveal="2">
            {intro}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
