'use client';

import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/tracking';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { COMPLEMENTO_OPTIONS, COMPLEMENTO_OUTRO } from '@/lib/mock-data';

type ComplementoSheetProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  onCustom: () => void;
};

export function ComplementoSheet({ open, onClose, onSelect, onCustom }: ComplementoSheetProps) {
  const pathname = usePathname();

  return (
    <BottomSheet open={open} onClose={onClose} sheetId="complemento" title="Selecione o complemento">
      <div className="flex flex-col">
        {COMPLEMENTO_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              trackEvent('element_click', pathname, `complemento-opcao-${option}`);
              onSelect(option);
            }}
            className="border-b border-border py-3 text-left text-base text-verde-escuro last:border-b-0"
          >
            {option}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            trackEvent('element_click', pathname, 'complemento-nao-encontrei');
            onCustom();
          }}
          className="pt-3 text-left text-base text-verde-escuro"
        >
          {COMPLEMENTO_OUTRO}
        </button>
      </div>
    </BottomSheet>
  );
}
