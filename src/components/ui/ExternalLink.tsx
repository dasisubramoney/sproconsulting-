import type { AnchorHTMLAttributes } from 'react';

/** All off-site links go through here so rel/target stay consistent. */
export function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" {...props} rel="noopener noreferrer" />;
}
