/**
 * Decorative line chart beside the 2030 population figure. The site states only the
 * end point (65–67 million by 2030), so the line is an illustrative rising trend with
 * no other values on it: the copper end point and the range tick are the only data.
 * Draws on scroll (src/motion/WaterMotion.tsx); static without JS or with reduced motion.
 */
export function PopulationChart({ year }: { year: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 100"
      className="mt-8 block w-full max-w-sm overflow-visible fill-none"
      data-population-chart
    >
      {/* Axes */}
      <path d="M8 6V84H232" className="stroke-steel-200" strokeWidth="1" />
      {/* Range tick for 65–67 million */}
      <path d="M224 13V27" className="stroke-copper-300" strokeWidth="2" strokeLinecap="round" />
      <path
        data-chart-line
        d="M8 76C72 71 148 52 224 20"
        className="stroke-steel-700"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle data-chart-end cx="224" cy="20" r="4" className="fill-copper-500" />
      <text x="224" y="97" textAnchor="middle" className="fill-steel-600 text-[9px] font-semibold">
        {year}
      </text>
    </svg>
  );
}
