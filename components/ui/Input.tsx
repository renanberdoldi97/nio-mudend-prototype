'use client';

import { useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  trackingId: string;
  placeholder?: string;
  type?: 'text' | 'tel' | 'email';
  disabled?: boolean;
  className?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  /** Mostra borda verde-escuro (#124803) + checkmark, independente do foco. */
  valid?: boolean;
  /** Mostra um spinner no lugar do checkmark (ex: consultando CEP). */
  loading?: boolean;
  /** Mensagem de erro — mostra borda vermelha + texto abaixo. */
  error?: string;
  /** Texto de apoio cinza-claro abaixo do campo (ex: feedback de CEP resolvido). */
  hint?: string;
  onBlurExtra?: () => void;
};

export function Input({
  label,
  value,
  onChange,
  trackingId,
  placeholder,
  type = 'text',
  disabled = false,
  className,
  inputMode,
  valid = false,
  loading = false,
  error,
  hint,
  onBlurExtra,
}: InputProps) {
  const id = useId();
  const pathname = usePathname();
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const hasError = Boolean(error);

  return (
    <div>
      <div
        className={cn(
          'relative w-full h-14 rounded-md border-[1.5px] px-4 pt-4 transition-colors',
          hasError
            ? 'border-error'
            : valid
              ? 'border-primary-background'
              : focused
                ? 'border-primary-background'
                : 'border-border',
          disabled ? 'opacity-50' : 'bg-white',
          className
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            'absolute left-4 transition-all pointer-events-none text-text-secondary',
            focused || hasValue ? 'top-1.5 text-xs' : 'top-1/2 -translate-y-1/2 text-base'
          )}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          disabled={disabled}
          placeholder={focused ? placeholder : undefined}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            trackEvent('form_input', pathname, trackingId, { length: value.length });
            onBlurExtra?.();
          }}
          className={cn(
            'absolute inset-x-4 bottom-1.5 h-6 bg-transparent outline-none text-base text-text-primary',
            (valid || loading) && 'pr-6'
          )}
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-border border-t-primary-background animate-spin" />
        )}
        {valid && !loading && (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5"
          >
            <circle cx="10" cy="10" r="9" fill="#124803" />
            <path
              d="M6 10.5L8.5 13L14 7"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {hasError && <p className="mt-1.5 px-1 text-xs text-error">{error}</p>}
      {!hasError && hint && <p className="mt-1.5 px-1 text-xs text-text-disabled">{hint}</p>}
    </div>
  );
}
