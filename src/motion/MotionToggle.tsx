import { setUserReducesMotion } from './preference';
import { useReducedMotion, useSystemReducedMotion } from './useReducedMotion';

/**
 * Footer switch for reduced motion, remembered in localStorage. When the OS asks
 * for reduced motion the switch shows "on" and is disabled, since the site
 * always honours the OS setting.
 */
export function MotionToggle() {
  const reduced = useReducedMotion();
  const system = useSystemReducedMotion();

  return (
    <button
      type="button"
      aria-pressed={reduced}
      disabled={system}
      onClick={() => setUserReducesMotion(!reduced)}
      className="group inline-flex min-h-7 items-center gap-2 hover:text-white disabled:cursor-default disabled:hover:text-inherit"
    >
      <span
        aria-hidden="true"
        className={`relative inline-block h-4 w-7 rounded-full border transition-colors ${
          reduced ? 'border-white bg-white' : 'border-navy-200 bg-transparent'
        }`}
      >
        <span
          className={`absolute top-0.5 h-2.5 w-2.5 rounded-full transition-transform ${
            reduced ? 'left-0.5 translate-x-3 bg-navy' : 'left-0.5 bg-navy-200'
          }`}
        />
      </span>
      Reduce motion
      {system && <span className="text-navy-200">(device setting)</span>}
    </button>
  );
}
