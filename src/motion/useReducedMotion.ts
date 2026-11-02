import { useSyncExternalStore } from 'react';
import { isMotionReduced, subscribeMotionPreference, systemReducesMotion } from './preference';

/**
 * True when motion should be reduced (OS setting or the footer toggle).
 * False while pre-rendering and hydrating, then updates, so the first client
 * render always matches the static HTML.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotionPreference, isMotionReduced, () => false);
}

/** True when the OS itself asks for reduced motion (the footer toggle can't override it). */
export function useSystemReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotionPreference, systemReducesMotion, () => false);
}
