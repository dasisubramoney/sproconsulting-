import type { RefObject } from 'react';
import { belowFold, gsap, SplitText, useGSAP } from './gsap';
import { duration, ease, revealStart, stagger } from './tokens';

/**
 * [data-split] headings rise line by line from a mask as they scroll into view.
 *
 * SplitText's aria: 'auto' puts the full text in aria-label on the heading and
 * aria-hidden on the line spans, so screen readers hear the heading once.
 * Once revealed, the split is reverted to the original markup.
 *
 * Only use data-split on headings whose text never changes after render:
 * SplitText rewrites the heading's children, outside React's knowledge.
 */
export function useSplitHeading(scope: RefObject<HTMLElement | null>, reduced: boolean): void {
  useGSAP(
    () => {
      if (reduced || !scope.current) return;

      for (const heading of gsap.utils.toArray<HTMLElement>('[data-split]', scope.current).filter(belowFold)) {
        SplitText.create(heading, {
          type: 'lines',
          tag: 'span',
          linesClass: 'split-line',
          mask: 'lines',
          aria: 'auto',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: duration.heading,
              ease: ease.expo,
              stagger: stagger.lines,
              scrollTrigger: { trigger: heading, start: revealStart, once: true },
              onComplete: () => self.revert(),
            }),
        });
      }
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}
