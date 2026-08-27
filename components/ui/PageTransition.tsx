'use client';

import { motion } from 'framer-motion';

type PageTransitionProps = {
  children: React.ReactNode;
  variant?: 'slide' | 'fade';
  className?: string;
};

const variants = {
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 40 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.15 },
  },
};

export function PageTransition({ children, variant = 'slide', className }: PageTransitionProps) {
  const config = variants[variant];

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      transition={config.transition}
      className={className ?? 'flex flex-col h-full'}
    >
      {children}
    </motion.div>
  );
}
