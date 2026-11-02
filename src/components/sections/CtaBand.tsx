import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { company } from '@/content/company';
import { SlashBands } from '@/components/ui/SlashBands';

interface CtaBandProps {
  title?: string;
  body?: string;
}

export function CtaBand({
  title = 'Planning a project?',
  body = 'Talk to our engineers about electrical, mechanical, fire, HVAC and wet services for your next development.',
}: CtaBandProps) {
  return (
    <section aria-labelledby="cta-heading" className="on-dark relative isolate overflow-hidden bg-navy text-white">
      <SlashBands region="-z-10 inset-y-0 right-0 hidden w-[38%] lg:block" angle={-20} />
      <div className="container-page py-16 sm:py-20">
        <div className="max-w-xl">
          <h2 id="cta-heading" className="text-h2">
            {title}
          </h2>
          <p className="mt-4 text-navy-50">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">
              Contact us <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a href={`tel:${company.contact.phoneE164}`} className="btn-on-dark">
              Call {company.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
