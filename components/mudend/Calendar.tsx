'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';
import type { CalendarDayStatus } from '@/lib/types';

type CalendarDay = {
  date: string; // ISO yyyy-mm-dd
  label: number;
  weekday: string;
  status: CalendarDayStatus;
};

// Bloqueia domingos e mais dois dias fixos (simulando agenda cheia), pra ter
// uma mistura de disponível/bloqueado nos primeiros dias exibidos.
const BLOCKED_OFFSETS = new Set([3, 10]);

function buildDays(count: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

  for (let offset = 1; offset <= count; offset++) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const isSunday = date.getDay() === 0;
    const status: CalendarDayStatus =
      isSunday || BLOCKED_OFFSETS.has(offset) ? 'bloqueado' : 'disponivel';

    days.push({
      date: date.toISOString().slice(0, 10),
      label: date.getDate(),
      weekday: weekdayFormatter.format(date).replace('.', ''),
      status,
    });
  }

  return days;
}

type CalendarProps = {
  selectedDate: string | null;
  onSelect: (date: string) => void;
};

export function Calendar({ selectedDate, onSelect }: CalendarProps) {
  const pathname = usePathname();
  const days = buildDays(21);

  function handleClick(day: CalendarDay) {
    trackEvent('calendar_click', pathname, `calendar-day-${day.date}`, {
      date: day.date,
      status: day.status,
    });
    if (day.status === 'disponivel') {
      onSelect(day.date);
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {days.map((day) => {
        const isSelected = day.date === selectedDate;
        const isBlocked = day.status === 'bloqueado';

        return (
          <button
            key={day.date}
            type="button"
            onClick={() => handleClick(day)}
            disabled={isBlocked}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 rounded-lg border-[1.5px] py-3',
              isBlocked && 'border-transparent bg-card-content text-text-secondary opacity-50 cursor-not-allowed',
              !isBlocked && !isSelected && 'border-border bg-white text-verde-escuro',
              isSelected && 'border-primary-background bg-verde-claro text-verde-escuro'
            )}
          >
            <span className="text-[10px] uppercase tracking-wide">{day.weekday}</span>
            <span className="text-base font-semibold">{day.label}</span>
          </button>
        );
      })}
    </div>
  );
}
