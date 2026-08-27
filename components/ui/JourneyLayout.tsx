'use client';

import { PageTransition } from './PageTransition';
import { Header } from './Header';

type JourneyLayoutProps = {
  title?: string;
  onBack?: () => void;
  cta?: React.ReactNode;
  overlay?: React.ReactNode;
  transitionVariant?: 'slide' | 'fade';
  children: React.ReactNode;
};

export function JourneyLayout({
  title,
  onBack,
  cta,
  overlay,
  transitionVariant = 'slide',
  children,
}: JourneyLayoutProps) {
  return (
    <PageTransition variant={transitionVariant}>
      <Header title={title} onBack={onBack} />
      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-40 pt-4">{children}</main>
      {cta && (
        <div className="absolute inset-x-0 bottom-0 bg-areia/95 backdrop-blur px-4 pb-6 pt-3 border-t border-border">
          {cta}
        </div>
      )}
      {overlay}
    </PageTransition>
  );
}
