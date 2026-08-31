'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';

type FlowHeaderProps = {
  title: string;
  onBack?: () => void;
  rightAction?: 'sair' | 'close' | 'none';
  onExitRequest?: () => void;
  onClose?: () => void;
  variant?: 'default' | 'hero';
  illustration?: React.ReactNode;
};

export function FlowHeader({
  title,
  onBack,
  rightAction = 'sair',
  onExitRequest,
  onClose,
  variant = 'default',
  illustration,
}: FlowHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHero = variant === 'hero';

  function handleBack() {
    trackEvent('element_click', pathname, 'header-back-button');
    if (onBack) onBack();
    else router.back();
  }

  return (
    <div className={cn('shrink-0', isHero && 'bg-[#14412A]')}>
      <header className="flex h-14 items-center justify-between px-4">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M15 19l-7-7 7-7"
              stroke={isHero ? '#FFFFFF' : '#192B1C'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1
          className={cn(
            'flex-1 truncate px-2 text-center text-base font-semibold',
            isHero ? 'text-white' : 'text-verde-escuro'
          )}
        >
          {title}
        </h1>
        {rightAction === 'sair' && (
          <button
            type="button"
            onClick={() => {
              trackEvent('element_click', pathname, 'header-sair-button');
              onExitRequest?.();
            }}
            className={cn(
              'w-9 text-right text-sm font-semibold',
              isHero ? 'text-verde-neon' : 'text-primary-background'
            )}
          >
            Sair
          </button>
        )}
        {rightAction === 'close' && (
          <button
            type="button"
            onClick={() => {
              trackEvent('element_click', pathname, 'header-close-button');
              onClose?.();
            }}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke={isHero ? '#FFFFFF' : '#192B1C'}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        {rightAction === 'none' && <span className="w-9" />}
      </header>
      {illustration && (
        <div className="flex items-center justify-center px-3">{illustration}</div>
      )}
    </div>
  );
}
