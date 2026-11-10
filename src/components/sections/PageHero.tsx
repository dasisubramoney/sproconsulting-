import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SketchLines } from '@/components/ui/SketchLines';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}

/** Standard interior-page header with quiet construction lines (DESIGN.md "Motif"). */
export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-steel-200 bg-white text-ink">
      {/* Beside the text from xl up, clear of the copy; none on smaller screens. */}
      <SketchLines region="-z-10 inset-y-6 right-0 hidden w-[28%] xl:block" intro />
      <div className="container-page pb-16 pt-16 sm:pb-20 sm:pt-20 xl:py-24">
        {eyebrow && (
          <p data-reveal>
            <Eyebrow intro>{eyebrow}</Eyebrow>
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-h1" data-reveal="1">
          {title}
        </h1>
        {intro && (
          <div className="mt-5 max-w-prose text-base leading-relaxed text-steel-600 sm:text-lg" data-reveal="2">
            {intro}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
