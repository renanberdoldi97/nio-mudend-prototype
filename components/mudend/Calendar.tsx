'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';
import { getBlockedReason } from '@/lib/holidays';

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function toKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

type ViewMonth = { year: number; month: number };

function isSameMonth(a: ViewMonth, b: ViewMonth) {
  return a.year === b.year && a.month === b.month;
}

type CalendarProps = {
  selectedDate: string | null;
  onSelect: (date: string) => void;
};

export function Calendar({ selectedDate, onSelect }: CalendarProps) {
  const pathname = usePathname();
  const today = new Date();
  const [view, setView] = useState<ViewMonth>({ year: today.getFullYear(), month: today.getMonth() });

  const rawMonthLabel = new Date(view.year, view.month, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  const monthLabel = rawMonthLabel.charAt(0).toUpperCase() + rawMonthLabel.slice(1);

  const firstDayOfMonth = new Date(view.year, view.month, 1);
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const leadingBlanks = firstDayOfMonth.getDay();

  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.year, view.month, i + 1)),
  ];

  const canGoPrev = !isSameMonth(view, { year: today.getFullYear(), month: today.getMonth() });

  function goPrev() {
    if (!canGoPrev) return;
    trackEvent('element_click', pathname, 'calendar-mes-anterior');
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }));
  }

  function goNext() {
    trackEvent('element_click', pathname, 'calendar-proximo-mes');
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }));
  }

  function handleDayClick(date: Date) {
    const key = toKey(date);
    const reason = getBlockedReason(date);
    if (reason) {
      trackEvent('calendar_click_blocked', pathname, `calendar-day-${key}`, {
        date: key,
        status: 'bloqueado',
        reason,
      });
      return;
    }
    trackEvent('calendar_click', pathname, `calendar-day-${key}`, { date: key, status: 'disponivel' });
    onSelect(key);
  }

  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          className={cn('flex h-8 w-8 items-center justify-center', !canGoPrev && 'opacity-30')}
          aria-label="Mês anterior"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="#192B1C"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-base font-semibold text-verde-escuro">{monthLabel}</span>
        <button
          type="button"
          onClick={goNext}
          className="flex h-8 w-8 items-center justify-center"
          aria-label="Próximo mês"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="#192B1C"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={i}
            className="flex h-8 items-center justify-center text-xs font-medium text-text-secondary"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;
          const key = toKey(date);
          const blocked = getBlockedReason(date);
          const isSelected = key === selectedDate;

          return (
            <div key={key} className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleDayClick(date)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
                  blocked && 'text-text-disabled',
                  !blocked && !isSelected && 'text-text-primary',
                  isSelected && 'bg-verde-neon font-semibold text-verde-escuro'
                )}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
