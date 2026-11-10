import type { ReactNode } from 'react';

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-steel-50 px-2 py-0.5 text-xs font-medium text-steel-700">
      {children}
    </span>
  );
}
