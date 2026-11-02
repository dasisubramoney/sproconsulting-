import { Helmet } from 'react-helmet-async';

/**
 * JSON-LD block. type="application/ld+json" is a data block, not script,
 * so it is unaffected by script-src 'self'.
 */
export function StructuredData({ data }: { data: object }) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
