import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False during pre-rendering and while React hydrates the pre-rendered HTML;
 * true afterwards (and immediately on client-side navigations). Use it for
 * anything that would make the first client render differ from the static HTML,
 * such as reading URL query parameters.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
