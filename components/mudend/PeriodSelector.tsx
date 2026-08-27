'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';
import type { Periodo } from '@/lib/types';

const OPTIONS: { value: Periodo; label: string; hint: string }[] = [
  { value: 'manha', label: 'Manhã', hint: '08:00 – 12:00' },
  { value: 'tarde', label: 'Tarde', hint: '13:00 – 18:00' },
];

type PeriodSelectorProps = {
  value: Periodo | null;
  onChange: (value: Periodo) => void;
};

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              trackEvent('element_click', pathname, `periodo-${option.value}`);
              onChange(option.value);
            }}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border-[1.5px] py-4',
              isSelected ? 'border-primary-background bg-verde-claro' : 'border-border bg-white'
            )}
          >
            <span className="text-base font-semibold text-verde-escuro">{option.label}</span>
            <span className="text-xs text-text-secondary">{option.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
