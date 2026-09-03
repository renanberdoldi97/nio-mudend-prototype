'use client';

import { useId } from 'react';
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
  const id = useId();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.checked;
    trackEvent('checkbox_toggle', pathname, trackingId, { checked: next });
    onChange(next);
  }

  return (
    // <label> nativo: clicar no texto OU na caixinha marca/desmarca o input.
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer select-none items-start gap-3 text-left',
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-background peer-focus-visible:ring-offset-2',
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
    </label>
  );
}
