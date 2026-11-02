import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { mainNav, serviceSlugs } from '@/config/routes';
import { serviceTitle } from '@/content/services';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useHydrated } from '@/hooks/useHydrated';
import { Logo } from '@/components/ui/Logo';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative inline-flex min-h-11 items-center px-3 text-sm font-semibold transition-colors hover:text-crimson ${
    isActive ? 'text-crimson' : 'text-navy'
  }`;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-white/85 ${
        scrolled ? 'border-transparent shadow-card' : 'border-surface-muted'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link to="/" className="rounded-sm">
          <Logo />
          <span className="sr-only"> — home</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) =>
              item.to === '/services' ? (
                <li key={item.to}>
                  <ServicesMenu />
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink to={item.to} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/contact" className="btn-primary hidden sm:inline-flex">
            Contact us
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-navy lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

/** Desktop disclosure menu for service pages (button + list, not an ARIA menu). */
function ServicesMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const active = pathname.startsWith('/services');

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex min-h-11 items-center gap-1 px-3 text-sm font-semibold transition-colors hover:text-crimson ${
          active ? 'text-crimson' : 'text-navy'
        }`}
      >
        Services
        <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full mt-2 w-64 border-t-2 border-crimson bg-white py-2 shadow-card"
      >
        <ul>
          <li>
            <NavLink
              to="/services"
              end
              className="block px-4 py-2.5 text-sm font-semibold text-navy hover:bg-surface-subtle"
            >
              All services
            </NavLink>
          </li>
          {serviceSlugs.map((slug) => (
            <li key={slug}>
              <NavLink
                to={`/services/${slug}`}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm hover:bg-surface-subtle ${isActive ? 'font-semibold text-crimson' : 'text-ink'}`
                }
              >
                {serviceTitle(slug)}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  // The portal target (document.body) only exists in the browser, not during pre-rendering.
  const hydrated = useHydrated();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('button, a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [open, onClose]);

  const duration = reduced ? 0 : 0.3;

  // Portalled to <body>: the header's backdrop-filter would otherwise become the
  // containing block for this fixed overlay and clip it to the header's height.
  if (!hydrated) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <m.div
            className="absolute inset-0 bg-navy-950/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="on-dark absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-navy text-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <Logo variant="light" />
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm"
              >
                <X aria-hidden="true" className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 px-4 pb-8 pt-4">
              <ul className="space-y-1">
                <li>
                  <MobileLink to="/" end>
                    Home
                  </MobileLink>
                </li>
                {mainNav.map((item) => (
                  <li key={item.to}>
                    <MobileLink to={item.to} end={item.to === '/services'}>
                      {item.label}
                    </MobileLink>
                    {item.to === '/services' && (
                      <ul className="mb-2 ml-4 border-l border-white/20 pl-3">
                        {serviceSlugs.map((slug) => (
                          <li key={slug}>
                            <NavLink
                              to={`/services/${slug}`}
                              className={({ isActive }) =>
                                `block py-2 text-sm ${isActive ? 'font-semibold text-white' : 'text-navy-100'}`
                              }
                            >
                              {serviceTitle(slug)}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary mt-8 w-full">
                Contact us
              </Link>
            </nav>
            {/* Signature slash at the foot of the drawer. */}
            <div aria-hidden="true" className="relative h-24 overflow-hidden">
              <div className="absolute -bottom-6 -left-10 h-10 w-[140%] -rotate-[18deg] bg-crimson" />
              <div className="absolute -bottom-12 -left-10 h-10 w-[140%] -rotate-[18deg] bg-maroon" />
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function MobileLink({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block py-3 text-lg font-semibold ${isActive ? 'text-white underline decoration-crimson decoration-2 underline-offset-8' : 'text-navy-50'}`
      }
    >
      {children}
    </NavLink>
  );
}
