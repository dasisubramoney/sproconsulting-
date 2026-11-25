import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SketchLines } from '@/components/ui/SketchLines';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  /**
   * Decorative graphic beside the text from xl up, in place of the construction lines
   * (e.g. a service page's enlarged schematic). Hidden below xl, so the page supplies
   * its own small-screen version in `children` if it wants one.
   */
  aside?: ReactNode;
  /**
   * The aside contains real controls (e.g. links), so it is not hidden from assistive
   * tech or pointer events; it then marks its own decorative parts aria-hidden.
   */
  asideInteractive?: boolean;
}

/** Standard interior-page header: quiet construction lines, or `aside` in their place (DESIGN.md "Motif"). */
export function PageHero({ eyebrow, title, intro, children, aside, asideInteractive = false }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-steel-200 bg-white text-ink">
      {/* Beside the text from xl up, clear of the copy; none on smaller screens. */}
      {!aside && <SketchLines region="-z-10 inset-y-6 right-0 hidden w-[28%] xl:block" intro />}
      <div
        className={`container-page pb-16 pt-16 sm:pb-20 sm:pt-20 xl:py-24${
          aside ? ' xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:gap-16' : ''
        }`}
      >
        <div>
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
        {aside && (
          <div
            aria-hidden={asideInteractive ? undefined : 'true'}
            className={`hidden xl:block${asideInteractive ? '' : ' pointer-events-none'}`}
            data-reveal="3"
          >
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
