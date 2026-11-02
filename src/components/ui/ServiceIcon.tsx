import { Cog, Droplets, Flame, Wind, Zap, type LucideProps } from 'lucide-react';
import type { ServiceIconKey } from '@/content/services';

const icons = { zap: Zap, cog: Cog, flame: Flame, wind: Wind, droplets: Droplets } as const;

export function ServiceIcon({ icon, ...props }: { icon: ServiceIconKey } & LucideProps) {
  const Icon = icons[icon];
  return <Icon aria-hidden="true" strokeWidth={1.75} {...props} />;
}
