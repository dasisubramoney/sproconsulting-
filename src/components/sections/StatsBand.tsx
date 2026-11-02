import { getStats } from '@/content/stats';

export function StatsBand() {
  const stats = getStats();
  return (
    <section aria-label="S-PRO in numbers" className="border-y border-surface-muted bg-surface-subtle">
      <dl className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col border-l-2 border-crimson pl-4">
            <dt className="text-sm leading-snug text-ink-muted">{stat.label}</dt>
            <dd className="order-first text-3xl font-bold tracking-tight text-navy sm:text-4xl" data-stat>
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
