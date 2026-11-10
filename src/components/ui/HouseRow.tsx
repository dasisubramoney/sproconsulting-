/**
 * Decorative: one small house per household in the carbon-footprint figure
 * (carbonFootprint.households). Steel houses fill copper in a diagonal wave when
 * scrolled into view (src/motion/WaterMotion.tsx); without JS or with reduced
 * motion they are all copper. The figure itself is stated in the text beside it.
 */
const COLS = 50;
const CELL = 10;

export function HouseRow({ count }: { count: number }) {
  const rows = Math.ceil(count / COLS);
  // Group houses by diagonal (column + row) so the wave runs corner to corner.
  const waves: Array<Array<[number, number]>> = [];
  for (let i = 0; i < count; i++) {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    (waves[c + r] ??= []).push([c, r]);
  }

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${COLS * CELL} ${rows * CELL}`}
      className="mt-8 block w-full max-w-xl"
      data-houses
    >
      <defs>
        <path id="sus-house" d="M1.5 5.2 5 2l3.5 3.2v3.6h-7z" />
        <pattern id="sus-house-grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
          <use href="#sus-house" className="fill-steel-200" />
        </pattern>
      </defs>
      <rect width={COLS * CELL} height={rows * CELL} fill="url(#sus-house-grid)" />
      <g className="fill-copper-500">
        {waves.map((houses, w) => (
          <g key={w} data-house-wave>
            {houses.map(([c, r]) => (
              <use key={c} href="#sus-house" x={c * CELL} y={r * CELL} />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
