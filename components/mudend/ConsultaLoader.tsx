'use client';

import { motion } from 'framer-motion';
import { NioIcon } from '@/components/icons';

type ConsultaLoaderProps = {
  phase: 'loading' | 'success';
  endereco: string;
};

export function ConsultaLoader({ phase, endereco }: ConsultaLoaderProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      {phase === 'loading' ? (
        <>
          <span className="h-16 w-16 rounded-full border-4 border-verde-claro border-t-primary-background animate-spin" />
          <div>
            <h2 className="text-lg font-semibold text-verde-escuro">Consultando viabilidade</h2>
            <p className="mt-1 text-sm text-text-secondary">Verificando cobertura Nio em {endereco}…</p>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-verde-neon">
            <NioIcon name="check" size={32} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-verde-escuro">Endereço disponível!</h2>
            <p className="mt-1 text-sm text-text-secondary">
              A Nio atende {endereco}. Vamos seguir com a mudança.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
