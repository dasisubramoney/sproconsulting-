import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { Writable } from 'node:stream';
import { AppProviders } from './AppProviders';
import App from './App';

export { allRoutes } from './config/routes';

export interface RenderResult {
  html: string;
  head: string;
  htmlAttributes: string;
}

/**
 * Renders one route to static HTML at build time (see scripts/prerender.mjs).
 * Waits for every lazy page chunk (onAllReady) so the output is complete and
 * contains no streaming <script> tags — required by the strict CSP.
 */
export function render(url: string): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {};

  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk.toString();
        callback();
      },
      final(callback) {
        const { helmet } = helmetContext;
        if (!helmet) return reject(new Error('Helmet context missing'));
        resolve({
          html,
          // `priority` holds the SEO tags (description, canonical, og:*) because Seo uses prioritizeSeoTags.
          head: [helmet.title, helmet.priority, helmet.meta, helmet.link, helmet.script]
            .map((part) => part.toString())
            .join('\n    '),
          htmlAttributes: helmet.htmlAttributes.toString(),
        });
        callback();
      },
    });

    const stream = renderToPipeableStream(
      <StrictMode>
        <HelmetProvider context={helmetContext}>
          <AppProviders>
            <StaticRouter location={url}>
              <App />
            </StaticRouter>
          </AppProviders>
        </HelmetProvider>
      </StrictMode>,
      {
        onAllReady() {
          stream.pipe(sink);
        },
        onShellError: reject,
        onError(error) {
          reject(error);
        },
      },
    );
  });
}
