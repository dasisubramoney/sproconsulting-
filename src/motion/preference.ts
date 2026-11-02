/**
 * Reduced-motion preference: the OS setting OR the footer "Reduce motion" toggle.
 *
 * public/motion-gate.js applies the same logic before first paint (it sets
 * html[data-reduce-motion]), so CSS animations never start for users who opted out.
 * Keep STORAGE_KEY and the attribute name in sync with that file.
 */

const STORAGE_KEY = 'sp-reduce-motion';
const QUERY = '(prefers-reduced-motion: reduce)';
const ATTR = 'data-reduce-motion';

const listeners = new Set<() => void>();
let userChoice: boolean | null = null;
let mql: MediaQueryList | null = null;

const isBrowser = () => typeof window !== 'undefined';

export function systemReducesMotion(): boolean {
  return isBrowser() && window.matchMedia(QUERY).matches;
}

export function userReducesMotion(): boolean {
  if (!isBrowser()) return false;
  if (userChoice === null) {
    try {
      userChoice = localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      userChoice = false;
    }
  }
  return userChoice;
}

export function isMotionReduced(): boolean {
  return userReducesMotion() || systemReducesMotion();
}

export function setUserReducesMotion(reduce: boolean): void {
  userChoice = reduce;
  try {
    if (reduce) localStorage.setItem(STORAGE_KEY, '1');
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode): the choice lasts for this page view only.
  }
  emit();
}

function emit() {
  document.documentElement.toggleAttribute(ATTR, isMotionReduced());
  listeners.forEach((listener) => listener());
}

/** useSyncExternalStore-compatible subscription. */
export function subscribeMotionPreference(listener: () => void): () => void {
  listeners.add(listener);
  if (!mql) {
    mql = window.matchMedia(QUERY);
    mql.addEventListener('change', emit);
  }
  return () => listeners.delete(listener);
}
