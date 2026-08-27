'use client';

import { usePathname, useRouter } from 'next/navigation';
import { NioIcon } from '@/components/icons';
import { trackEvent } from '@/lib/tracking';

type HeaderProps = {
  title?: string;
  onBack?: () => void;
  transparent?: boolean;
};

export function Header({ title, onBack, transparent = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleBack() {
    trackEvent('element_click', pathname, 'header-back-button');
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }

  return (
    <header
      className={
        transparent
          ? 'flex items-center h-14 px-4 shrink-0'
          : 'flex items-center h-14 px-4 shrink-0 bg-areia border-b border-border'
      }
    >
      <button
        type="button"
        onClick={handleBack}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60"
        aria-label="Voltar"
      >
        <NioIcon name="arrow-left" size={20} />
      </button>
      {title && (
        <h1 className="ml-2 text-lg font-semibold text-verde-escuro truncate">{title}</h1>
      )}
    </header>
  );
}
