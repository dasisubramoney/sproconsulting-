import { useState } from 'react';
import { Map as MapIcon } from 'lucide-react';
import { company } from '@/content/company';
import { ExternalLink } from '@/components/ui/ExternalLink';

const PAD = 0.008;

/**
 * Click-to-load OpenStreetMap embed. Nothing is requested from a third party
 * until the visitor opts in (privacy + keeps the CSP frame-src to one host).
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  const { lat, lng } = company.contact.map;
  const bbox = [lng - PAD, lat - PAD / 2, lng + PAD, lat + PAD / 2].join(',');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const fullMap = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-surface-muted bg-surface-subtle sm:aspect-video">
        {loaded ? (
          <iframe
            src={src}
            title={`Map showing ${company.shortName} offices in ${company.contact.address.suburb}, ${company.contact.address.city}`}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <MapIcon aria-hidden="true" className="h-10 w-10 text-navy-300" strokeWidth={1.5} />
            <p className="max-w-xs text-sm text-ink-muted">
              The map is provided by OpenStreetMap. Loading it shares your IP address with them.
            </p>
            <button type="button" onClick={() => setLoaded(true)} className="btn-secondary">
              Load map
            </button>
          </div>
        )}
      </div>
      <ExternalLink href={fullMap} className="mt-3 inline-block text-sm font-semibold text-navy underline hover:text-crimson">
        Open in OpenStreetMap<span className="sr-only"> (opens in a new tab)</span>
      </ExternalLink>
    </div>
  );
}
