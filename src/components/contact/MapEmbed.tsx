import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { company } from '@/content/company';
import { ExternalLink } from '@/components/ui/ExternalLink';

const PAD = 0.008;

interface MapEmbedProps {
  /** On an ink panel: steel-800 drafting grid, light text, copper-300 accents. */
  dark?: boolean;
}

/**
 * Click-to-load OpenStreetMap embed. Nothing is requested from a third party
 * until the visitor opts in (privacy + keeps the CSP frame-src to one host).
 * Until then a drafting-grid placeholder with a copper pin stands in for the map.
 */
export function MapEmbed({ dark = false }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const { lat, lng } = company.contact.map;
  const { suburb, city } = company.contact.address;
  const bbox = [lng - PAD, lat - PAD / 2, lng + PAD, lat + PAD / 2].join(',');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const fullMap = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;

  const grid = dark
    ? 'border-steel-800 bg-steel-900 [background-image:linear-gradient(theme(colors.steel.800)_1px,transparent_1px),linear-gradient(90deg,theme(colors.steel.800)_1px,transparent_1px)]'
    : 'border-steel-200 bg-white [background-image:linear-gradient(theme(colors.steel.100)_1px,transparent_1px),linear-gradient(90deg,theme(colors.steel.100)_1px,transparent_1px)]';

  return (
    <div>
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-sm border sm:aspect-video ${grid} [background-position:center] [background-size:24px_24px]`}
      >
        {loaded ? (
          <iframe
            src={src}
            title={`Map showing ${company.shortName} offices in ${suburb}, ${city}`}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            {/* Decorative: crossing "streets" and a pin with a slow pulse (off with reduced motion). */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 225"
              preserveAspectRatio="none"
              className={`pointer-events-none absolute inset-0 h-full w-full fill-none ${dark ? 'stroke-steel-700' : 'stroke-steel-200'}`}
              strokeWidth="6"
            >
              <path d="M-10 160 C 90 150 180 120 260 70 S 380 10 420 0" />
              <path d="M60 -10 L 150 240" strokeWidth="4" />
              <path d="M-10 60 H 420" strokeWidth="3" />
            </svg>
            <span aria-hidden="true" className="relative flex h-12 w-12 items-center justify-center">
              <span className={`absolute inset-0 animate-ping rounded-full opacity-40 [animation-duration:2s] ${dark ? 'bg-copper-300' : 'bg-copper-500'}`} />
              <span className={`relative flex h-12 w-12 items-center justify-center rounded-full ${dark ? 'bg-copper-300 text-ink' : 'bg-copper-700 text-white'}`}>
                <MapPin className="h-6 w-6" strokeWidth={2} />
              </span>
            </span>
            <p className={`relative text-sm font-semibold ${dark ? 'text-white' : 'text-steel-700'}`}>
              {suburb}, {city}
            </p>
            <p className={`relative max-w-xs text-xs leading-relaxed ${dark ? 'text-steel-200' : 'text-steel-600'}`}>
              The map is provided by OpenStreetMap. Loading it shares your IP address with them.
            </p>
            <button type="button" onClick={() => setLoaded(true)} className={`relative ${dark ? 'btn-on-dark bg-ink' : 'btn-secondary'}`}>
              Load map
            </button>
          </div>
        )}
      </div>
      <ExternalLink
        href={fullMap}
        className={`mt-3 inline-block text-sm font-semibold underline ${
          dark ? 'text-copper-300 hover:text-copper-100' : 'text-steel-700 hover:text-copper-800'
        }`}
      >
        Open in OpenStreetMap<span className="sr-only"> (opens in a new tab)</span>
      </ExternalLink>
    </div>
  );
}
