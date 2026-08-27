'use client';

import { motion } from 'framer-motion';
import { NioIcon } from '@/components/icons';

type SuccessScreenProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function SuccessScreen({ title, description, children }: SuccessScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-verde-neon"
      >
        <NioIcon name="check-circle" size={40} />
      </motion.span>
      <div>
        <h1 className="text-xl font-semibold text-verde-escuro">{title}</h1>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
      </div>
      {children}
    </div>
  );
}
