'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type ConsultaLoaderProps = {
  phase: 'loading' | 'success';
};

export function ConsultaLoader({ phase }: ConsultaLoaderProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
      {phase === 'loading' ? (
        <>
          <span className="h-14 w-14 rounded-full border-4 border-verde-claro border-t-verde-neon animate-spin" />
          <p className="text-base font-medium text-verde-escuro">
            Estamos conferindo se há cobertura Nio Fibra nesse endereço...
          </p>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-background">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M5 12.5L9.5 17L19 6.5"
                stroke="#124803"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="text-base font-medium text-verde-escuro">Nio Fibra está disponível!</p>
        </motion.div>
      )}
      <div className="absolute inset-x-0 bottom-10 flex justify-center">
        <Image src="/logo/Color=Default.svg" alt="Nio" width={64} height={34} unoptimized />
      </div>
    </div>
  );
}
