'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';

type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-background text-white font-semibold border-0',
  outline: 'bg-transparent text-verde-escuro font-semibold border-[1.5px] border-verde-escuro',
  secondary:
    'bg-transparent text-primary-background font-semibold border-[1.5px] border-primary-background',
  ghost: 'bg-transparent text-primary-background font-semibold border-0',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm rounded-full',
  md: 'h-14 px-6 text-base rounded-full',
  lg: 'h-14 px-8 text-base rounded-full',
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  /** Id semântico usado no evento element_click; se omitido, nenhum tracking automático ocorre. */
  trackingId?: string;
  trackingMetadata?: Record<string, unknown>;
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  loading = false,
  disabled = false,
  children,
  onClick,
  className,
  type = 'button',
  trackingId,
  trackingMetadata,
}: ButtonProps) {
  const pathname = usePathname();
  const isDisabled = disabled || loading;

  function handleClick() {
    if (isDisabled) return;
    if (trackingId) {
      trackEvent('element_click', pathname, trackingId, trackingMetadata);
    }
    onClick?.();
  }

  return (
    <motion.button
      type={type}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'flex items-center justify-center gap-2 transition-opacity',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : 'w-auto',
        isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      {loading ? (
        <span className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
}
