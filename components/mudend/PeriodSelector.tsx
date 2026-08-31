'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';
import type { Periodo } from '@/lib/types';

const OPTIONS: { value: Periodo; label: string; hint: string }[] = [
  { value: 'manha', label: 'Manhã', hint: '08:00 – 12:00' },
  { value: 'tarde', label: 'Tarde', hint: '14:00 – 18:00' },
];

function ClockIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0">
      <circle cx="10" cy="10" r="8" stroke={muted ? '#B0B0B0' : '#124803'} strokeWidth="1.5" />
      <path
        d="M10 6V10L12.5 12"
        stroke={muted ? '#B0B0B0' : '#124803'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PeriodSelectorProps = {
  value: Periodo | null;
  onChange: (value: Periodo | null) => void;
  /** Sem data selecionada: cards apagados e não clicáveis. */
  disabled?: boolean;
};

export function PeriodSelector({ value, onChange, disabled = false }: PeriodSelectorProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex flex-col gap-3', disabled && 'pointer-events-none opacity-40')}>
      {OPTIONS.map((option) => {
        const isSelected = !disabled && value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => {
              const next = value === option.value ? null : option.value;
              trackEvent('element_click', pathname, `periodo-${option.value}`, {
                acao: next ? 'selecionar' : 'desmarcar',
              });
              onChange(next);
            }}
            className={cn(
              'flex items-center gap-3 rounded-md border-[1.5px] px-4 py-3 text-left',
              isSelected ? 'border-primary-background bg-verde-claro' : 'border-border bg-white'
            )}
          >
            <ClockIcon muted={!isSelected} />
            <div className="flex-1">
              <p className={cn('text-sm', isSelected ? 'text-verde-escuro' : 'text-text-secondary')}>
                {option.label}
              </p>
              <p
                className={cn(
                  'text-sm font-semibold',
                  isSelected ? 'text-verde-escuro' : 'text-text-secondary'
                )}
              >
                {disabled ? 'Selecione uma data acima' : option.hint}
              </p>
            </div>
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                isSelected ? 'border-primary-background' : 'border-border'
              )}
            >
              {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-primary-background" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
