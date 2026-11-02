export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-sm bg-navy px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to main content
    </a>
  );
}
