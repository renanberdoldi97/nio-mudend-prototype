'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen } from '@/lib/tracking';
import { FlowHeader } from '@/components/ui/FlowHeader';
import { FlowScreen } from '@/components/ui/FlowScreen';
import { ExitConfirmSheet } from '@/components/ui/ExitConfirmSheet';
import { InstructionsList } from '@/components/mudend/InstructionsList';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { NioIcon } from '@/components/icons';

export default function InstrucoesPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const [exitOpen, setExitOpen] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  return (
    <FlowScreen
      header={
        <FlowHeader title="Agendamento da mudança" onExitRequest={() => setExitOpen(true)} />
      }
      cta={
        <Button
          trackingId="instrucoes-continuar"
          disabled={!confirmado}
          onClick={() => router.push('/mudend/agendamento')}
        >
          Iniciar agendamento
        </Button>
      }
      overlay={<ExitConfirmSheet open={exitOpen} onClose={() => setExitOpen(false)} />}
    >
      <span className="mb-3 flex h-8 w-8 items-center justify-center">
        <NioIcon name="calendar" size={24} />
      </span>
      <h1 className="mb-3 text-2xl font-semibold text-verde-escuro">
        Instruções pro agendamento da visita
      </h1>
      <p className="mb-5 text-sm text-text-secondary">
        No dia da instalação, é importante garantir os itens abaixo para que o técnico consiga
        realizar o atendimento.
      </p>

      <InstructionsList />

      <Checkbox
        className="mt-5"
        checked={confirmado}
        onChange={setConfirmado}
        trackingId="instrucoes-checkbox"
        label="Confirmo que os itens acima estarão garantidos no dia da visita."
      />
    </FlowScreen>
  );
}
