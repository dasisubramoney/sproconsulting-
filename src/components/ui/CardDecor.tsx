const corners = ['left-2 top-2', 'right-2 top-2', 'bottom-2 left-2', 'bottom-2 right-2'];

/**
 * Hover / focus decoration for a `.service-card`: a copper rule that draws along the
 * top edge and four steel registration crosshairs at the corners (CSS in index.css).
 * Place it as the first child of the card. Decorative.
 */
export function CardDecor() {
  return (
    <>
      <span aria-hidden="true" className="card-rule absolute inset-x-0 top-0 h-0.5 bg-copper-500" />
      {corners.map((pos) => (
        <svg
          key={pos}
          aria-hidden="true"
          viewBox="0 0 10 10"
          className={`card-mark pointer-events-none absolute h-2.5 w-2.5 fill-none stroke-steel-500 ${pos}`}
          strokeWidth="1"
        >
          <path d="M5 0V10M0 5H10" />
        </svg>
      ))}
    </>
  );
}
