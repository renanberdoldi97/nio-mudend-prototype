'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';
import { getBlockedReason } from '@/lib/holidays';

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

/** Janela de agendamento: hoje + próximos 30 dias corridos. */
const WINDOW_DAYS = 30;

function toKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

type ViewMonth = { year: number; month: number };

function isSameMonth(a: ViewMonth, b: ViewMonth) {
  return a.year === b.year && a.month === b.month;
}

function isBeforeMonth(a: ViewMonth, b: ViewMonth) {
  return a.year < b.year || (a.year === b.year && a.month < b.month);
}

type CalendarProps = {
  selectedDate: string | null;
  onSelect: (date: string) => void;
};

export function Calendar({ selectedDate, onSelect }: CalendarProps) {
  const pathname = usePathname();
  const today = startOfDay(new Date());
  const windowEnd = startOfDay(new Date(today.getTime() + WINDOW_DAYS * 24 * 60 * 60 * 1000));

  const currentMonth: ViewMonth = { year: today.getFullYear(), month: today.getMonth() };
  const endMonth: ViewMonth = { year: windowEnd.getFullYear(), month: windowEnd.getMonth() };

  const [view, setView] = useState<ViewMonth>(currentMonth);

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

  const canGoPrev = !isSameMonth(view, currentMonth);
  const canGoNext = isBeforeMonth(view, endMonth);

  /** Fora da janela de 30 dias (antes de hoje ou depois do limite). */
  function isOutsideWindow(date: Date): boolean {
    const d = startOfDay(date).getTime();
    return d < today.getTime() || d > windowEnd.getTime();
  }

  function blockedReason(date: Date): string | null {
    if (isOutsideWindow(date)) return 'fora-da-janela';
    return getBlockedReason(date);
  }

  function goPrev() {
    if (!canGoPrev) return;
    trackEvent('element_click', pathname, 'calendar-mes-anterior');
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }));
  }

  function goNext() {
    if (!canGoNext) return;
    trackEvent('element_click', pathname, 'calendar-proximo-mes');
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }));
  }

  function handleDayClick(date: Date) {
    const key = toKey(date);
    const reason = blockedReason(date);
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
          disabled={!canGoNext}
          className={cn('flex h-8 w-8 items-center justify-center', !canGoNext && 'opacity-30')}
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
          const blocked = blockedReason(date);
          const isSelected = key === selectedDate;

          return (
            <div key={key} className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleDayClick(date)}
                disabled={Boolean(blocked)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
                  blocked && 'cursor-not-allowed text-text-disabled',
                  !blocked && !isSelected && 'text-text-primary',
                  isSelected && 'bg-primary-background font-semibold text-white'
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
