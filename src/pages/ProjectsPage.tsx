import { useId, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { X } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { serviceSlugs, type ServiceSlug } from '@/config/routes';
import { projects, projectYear, type Project } from '@/content/projects';
import { services } from '@/content/services';
import { projectYearRange } from '@/content/stats';
import { useHydrated } from '@/hooks/useHydrated';

/** A project counts for a year if it was active in that year. */
function activeIn(project: Project, year: number): boolean {
  return project.startYear <= year && year <= projectYear(project);
}

const years = [...new Set(projects.flatMap((p) => {
  const out: number[] = [];
  for (let y = p.startYear; y <= projectYear(p); y++) out.push(y);
  return out;
}))].sort((a, b) => b - a);

export default function ProjectsPage() {
  const [searchParams, setParams] = useSearchParams();
  // The page is pre-rendered unfiltered; apply ?year= / ?discipline= only after hydration.
  const hydrated = useHydrated();
  const params = hydrated ? searchParams : new URLSearchParams();
  const yearId = useId();
  const disciplineId = useId();

  const yearParam = Number(params.get('year'));
  const year = years.includes(yearParam) ? yearParam : null;
  const disciplineParam = params.get('discipline');
  const discipline = serviceSlugs.includes(disciplineParam as ServiceSlug) ? (disciplineParam as ServiceSlug) : null;

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) => (year === null || activeIn(p, year)) && (discipline === null || p.disciplines.includes(discipline)),
      ),
    [year, discipline],
  );

  const groups = useMemo(() => {
    const map = new Map<number, Project[]>();
    for (const p of filtered) {
      const key = projectYear(p);
      map.set(key, [...(map.get(key) ?? []), p]);
    }
    return [...map.entries()].sort(([a], [b]) => b - a);
  }, [filtered]);

  const update = (key: 'year' | 'discipline', value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const hasFilters = year !== null || discipline !== null;
  const selectClass =
    'mt-1 block min-h-11 w-full rounded-sm border border-navy-200 bg-white px-3 text-sm text-ink focus:border-navy';

  return (
    <>
      <Seo
        title="Project experience"
        description={`S-PRO project experience from ${projectYearRange.earliest} to ${projectYearRange.latest}: airports, hospitals, malls, stations, campuses and industrial facilities.`}
      />
      <PageHero
        eyebrow="Projects"
        title="Project experience"
        intro={`${projects.length} projects from ${projectYearRange.earliest} to ${projectYearRange.latest} — airports, hospitals, malls, stations, campuses and industrial facilities.`}
      />

      <section aria-labelledby="filters-heading" className="z-30 border-b border-surface-muted bg-white/95 backdrop-blur sm:sticky sm:top-16 lg:top-20">
        <div className="container-page grid grid-cols-2 gap-x-3 gap-y-3 py-4 sm:flex sm:items-end sm:gap-4">
          <h2 id="filters-heading" className="sr-only">
            Filter projects
          </h2>
          <div className="sm:w-48">
            <label htmlFor={yearId} className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Year
            </label>
            <select id={yearId} value={year ?? ''} onChange={(e) => update('year', e.target.value)} className={selectClass}>
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-56">
            <label htmlFor={disciplineId} className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Discipline
            </label>
            <select
              id={disciplineId}
              value={discipline ?? ''}
              onChange={(e) => update('discipline', e.target.value)}
              className={selectClass}
            >
              <option value="">All disciplines</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 flex items-center justify-between gap-4 sm:ml-auto sm:justify-end">
            <p role="status" aria-live="polite" className="text-sm text-ink-muted">
              Showing <strong className="text-navy">{filtered.length}</strong> of {projects.length} projects
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })}
                className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-navy hover:text-crimson"
              >
                <X aria-hidden="true" className="h-4 w-4" /> Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section aria-label="Projects by year" className="container-page py-16 sm:py-20">
        {groups.length === 0 ? (
          <p className="py-12 text-center text-ink-muted">No projects match these filters.</p>
        ) : (
          <ol className="relative space-y-14 border-l border-surface-muted pl-6 sm:pl-10">
            {groups.map(([groupYear, items]) => (
              <li key={groupYear} className="relative">
                <span aria-hidden="true" className="absolute -left-[1.85rem] top-2 h-3 w-3 bg-crimson sm:-left-[2.85rem]" />
                <h2 className="text-h2 text-navy">{groupYear}</h2>
                <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    // CSS fade-in runs when a card mounts, so cards revealed by a filter change fade in.
                    <li key={p.id} className="motion-safe:animate-card-in">
                      <ProjectCard project={p} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </section>

      <CtaBand />
    </>
  );
}
