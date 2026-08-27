'use client';

import { cn } from '@/lib/utils';
import { PageTransition } from './PageTransition';

type FlowScreenProps = {
  header: React.ReactNode;
  cta?: React.ReactNode;
  overlay?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function FlowScreen({ header, cta, overlay, children, className }: FlowScreenProps) {
  return (
    <PageTransition variant="slide">
      {header}
      <main
        className={cn(
          'flex-1 overflow-y-auto no-scrollbar px-4 pt-4',
          cta ? 'pb-40' : 'pb-6',
          className
        )}
      >
        {children}
      </main>
      {cta && (
        <div className="absolute inset-x-0 bottom-0 border-t border-border bg-areia/95 px-4 pb-6 pt-3 backdrop-blur">
          {cta}
        </div>
      )}
      {overlay}
    </PageTransition>
  );
}
