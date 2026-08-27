'use client';

import { useEffect, useState } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMudendStore } from '@/lib/store';
import { formatPhone } from '@/lib/utils';

type AlterarContatoSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function AlterarContatoSheet({ open, onClose }: AlterarContatoSheetProps) {
  const telefoneContato = useMudendStore((state) => state.telefoneContato);
  const updateTelefoneContato = useMudendStore((state) => state.updateTelefoneContato);
  const [value, setValue] = useState(telefoneContato);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setValue(telefoneContato);
      setDirty(false);
    }
  }, [open, telefoneContato]);

  function handleSave() {
    updateTelefoneContato(value);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} sheetId="alterar-contato" title="Alterar contato">
      <Input
        label="Telefone principal"
        value={value}
        onChange={(v) => {
          setValue(formatPhone(v));
          setDirty(true);
        }}
        trackingId="alterar-contato-telefone"
        inputMode="tel"
      />
      <Button
        className="mt-4"
        trackingId="alterar-contato-salvar"
        disabled={!dirty || value.replace(/\D/g, '').length < 10}
        onClick={handleSave}
      >
        Salvar
      </Button>
    </BottomSheet>
  );
}
