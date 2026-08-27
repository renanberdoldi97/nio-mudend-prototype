'use client';

import { usePathname, useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/tracking';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

type ExitConfirmSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function ExitConfirmSheet({ open, onClose }: ExitConfirmSheetProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleContinue() {
    trackEvent('element_click', pathname, 'exit-sheet-continuar');
    onClose();
  }

  function handleExit() {
    trackEvent('element_click', pathname, 'exit-sheet-sair-cancelar');
    onClose();
    router.push('/');
  }

  return (
    <BottomSheet open={open} onClose={onClose} sheetId="exit-confirm">
      <h2 className="mb-3 text-lg font-semibold text-verde-escuro">Tem certeza que quer sair agora?</h2>
      <p className="mb-1 text-sm text-text-secondary">
        Seu pedido de mudança de endereço ainda não foi concluído.
      </p>
      <p className="mb-5 text-sm text-text-secondary">
        Se você sair, vai precisar refazer o agendamento depois.
      </p>
      <Button trackingId="exit-sheet-continuar-btn" onClick={handleContinue} className="mb-3">
        Continuar agendamento
      </Button>
      <button
        type="button"
        onClick={handleExit}
        className="w-full py-2 text-center text-sm font-semibold text-primary-background"
      >
        Sair e cancelar pedido
      </button>
    </BottomSheet>
  );
}
