import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { company } from '@/content/company';
import { SweepDivider } from '@/components/ui/SweepDivider';

interface CtaBandProps {
  title?: string;
  body?: string;
}

export function CtaBand({
  title = 'Planning a project?',
  body = 'Talk to our engineers about electrical, mechanical, fire, HVAC and wet services for your next development.',
}: CtaBandProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden border-t border-steel-200 bg-white text-ink"
    >
      <SweepDivider className="absolute inset-x-0 top-0" />
      <div className="container-page py-16 sm:py-20">
        <div className="max-w-xl">
          <h2 id="cta-heading" className="text-h2 text-steel-700">
            {title}
          </h2>
          <p className="mt-4 text-steel-600">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">
              Contact us <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a href={`tel:${company.contact.phoneE164}`} className="btn-secondary">
              Call {company.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
