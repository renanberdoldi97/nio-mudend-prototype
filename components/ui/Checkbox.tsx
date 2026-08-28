'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  trackingId: string;
  label: React.ReactNode;
  className?: string;
};

export function Checkbox({ checked, onChange, trackingId, label, className }: CheckboxProps) {
  const pathname = usePathname();

  function toggle() {
    const next = !checked;
    trackEvent('checkbox_toggle', pathname, trackingId, { checked: next });
    onChange(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn('flex items-start gap-3 text-left', className)}
    >
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors',
          checked ? 'bg-primary-background border-primary-background' : 'border-border bg-white'
        )}
      >
        {checked && (
          <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
            <path
              d="M3 8.5L6.5 12L13 4.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-sm text-verde-escuro">{label}</span>
    </button>
  );
}
