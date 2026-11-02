import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import '@fontsource-variable/montserrat/wght.css';
import './styles/index.css';
import { AppProviders } from './AppProviders';
import App from './App';

const app = (
  <StrictMode>
    <HelmetProvider>
      <AppProviders>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProviders>
    </HelmetProvider>
  </StrictMode>
);

const root = document.getElementById('root')!;

// Production pages are pre-rendered (scripts/prerender.mjs): hydrate them.
// In `npm run dev` the root is empty, so render from scratch.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
