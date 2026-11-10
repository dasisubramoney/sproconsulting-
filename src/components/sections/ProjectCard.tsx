import { Handshake, MapPin } from 'lucide-react';
import { projectYears, type Project } from '@/content/projects';
import { serviceTitle } from '@/content/services';
import { Tag } from '@/components/ui/Tag';

interface ProjectCardProps {
  project: Project;
  headingLevel?: 'h3' | 'h4';
}

export function ProjectCard({ project, headingLevel: Heading = 'h3' }: ProjectCardProps) {
  const { location } = project;
  const place = location ? [location.city, location.region, location.country].filter(Boolean).join(', ') : null;

  return (
    <article className="group relative flex h-full flex-col border border-steel-200 bg-white p-6 transition-shadow hover:shadow-card">
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-1 w-12 bg-copper-500 transition-all duration-300 ease-brand group-hover:w-full"
      />
      <p className="text-sm font-semibold text-copper-700">{projectYears(project)}</p>
      <Heading className="mt-1 text-h3 text-steel-700">{project.name}</Heading>
      <p className="mt-3 text-sm text-ink">{project.nature}</p>
      {project.scope && <p className="mt-2 text-sm leading-relaxed text-steel-600">{project.scope}</p>}

      {(place || project.partner) && (
        <ul className="mt-4 space-y-1 text-sm text-steel-600">
          {place && (
            <li className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
              {place}
            </li>
          )}
          {project.partner && (
            <li className="flex items-center gap-2">
              <Handshake aria-hidden="true" className="h-4 w-4 shrink-0" />
              With {project.partner}
            </li>
          )}
        </ul>
      )}

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Disciplines">
        {project.disciplines.map((d) => (
          <li key={d}>
            <Tag>{serviceTitle(d)}</Tag>
          </li>
        ))}
      </ul>
    </article>
  );
}
