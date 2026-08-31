'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CardVariant = 'neutral' | 'white' | 'selected';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const variantStyles: Record<CardVariant, string> = {
  neutral: 'bg-card-content border border-card-border',
  white: 'bg-white border border-border',
  selected: 'bg-verde-claro border-[1.5px] border-primary-background',
};

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

type CardProps = {
  variant?: CardVariant;
  padding?: CardPadding;
  elevated?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Card({
  variant = 'neutral',
  padding = 'md',
  elevated = false,
  onClick,
  children,
  className,
}: CardProps) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        'rounded-lg',
        variantStyles[variant],
        paddingStyles[padding],
        elevated && 'shadow-card',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
