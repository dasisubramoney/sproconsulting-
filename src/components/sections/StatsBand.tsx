import { getStats } from '@/content/stats';

/** One of the site's few dark (ink) sections: copper figures glow against it. */
export function StatsBand() {
  const stats = getStats();
  return (
    <section aria-label="S-PRO in numbers" className="on-dark bg-ink text-white">
      <dl className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col border-l-2 border-copper-500 pl-4">
            <dt className="text-sm leading-snug text-steel-200">{stat.label}</dt>
            <dd className="order-first text-3xl font-bold tracking-tight text-copper-300 sm:text-4xl" data-stat>
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
