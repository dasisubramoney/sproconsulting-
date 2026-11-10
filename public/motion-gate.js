/*
 * Runs in <head> before first paint (a tiny blocking script: the CSP forbids inline
 * scripts, so it lives in its own file).
 *  - html[data-reduce-motion]: the OS or the footer toggle asks for reduced motion,
 *    so CSS animations are switched off before they can start.
 *  - html[data-intro]: show the first-visit intro (once per browser session).
 *  - html[data-js]: scripts run, so scroll-driven graphics (the home hero's "built"
 *    layers) may start hidden; without JS they are simply shown complete.
 * Keep in sync with src/motion/preference.ts and src/motion/IntroOverlay.tsx.
 */
(function () {
  var root = document.documentElement;
  root.setAttribute('data-js', '');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    reduce = reduce || localStorage.getItem('sp-reduce-motion') === '1';
    if (!reduce && !sessionStorage.getItem('sp-intro-seen')) {
      sessionStorage.setItem('sp-intro-seen', '1');
      root.setAttribute('data-intro', '');
    }
  } catch (e) {
    // Storage blocked (private mode, site data off): no intro, OS setting still applies.
  }
  if (reduce) root.setAttribute('data-reduce-motion', '');
})();
