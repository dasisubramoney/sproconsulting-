import { projects, projectYear } from './projects';
import { services } from './services';
import { carbonFootprint } from './sustainability';

/**
 * Headline numbers, all derived from the content files — never hardcode these.
 */

const earliestYear = Math.min(...projects.map((p) => p.startYear));
const latestYear = Math.max(...projects.map(projectYear));

const countries = new Set(projects.flatMap((p) => (p.location ? [p.location.country] : [])));

export interface Stat {
  value: string;
  label: string;
}

export function getStats(now: Date = new Date()): Stat[] {
  return [
    // Track record dates from the earliest project in the profile (V&A Waterfront, 1999).
    { value: `${now.getFullYear() - earliestYear}+`, label: `Years of project experience, since ${earliestYear}` },
    { value: String(projects.length), label: 'Projects in our portfolio' },
    { value: String(services.length), label: 'Engineering disciplines' },
    { value: String(countries.size), label: 'Countries' },
    {
      value: `${(carbonFootprint.litresSavedPerYear / 1_000_000).toFixed(2)}M`,
      label: `Litres of water a year — potential saving across ${carbonFootprint.households} households`,
    },
  ];
}

export const projectYearRange = { earliest: earliestYear, latest: latestYear };
