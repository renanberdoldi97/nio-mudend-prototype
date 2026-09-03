'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen } from '@/lib/tracking';
import { FlowHeader } from '@/components/ui/FlowHeader';
import { FlowScreen } from '@/components/ui/FlowScreen';
import { ExitConfirmSheet } from '@/components/ui/ExitConfirmSheet';
import { ConfirmationSummary } from '@/components/mudend/ConfirmationSummary';
import { AlterarContatoSheet } from '@/components/mudend/AlterarContatoSheet';
import { Button } from '@/components/ui/Button';
import { useMudendStore } from '@/lib/store';
import { gerarProtocolo } from '@/lib/mock-data';

export default function ConfirmacaoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const [exitOpen, setExitOpen] = useState(false);
  const [contatoSheetOpen, setContatoSheetOpen] = useState(false);
  const setProtocolo = useMudendStore((state) => state.setProtocolo);

  function handleConfirmar() {
    setProtocolo(gerarProtocolo());
    router.push('/mudend/sucesso');
  }

  return (
    <FlowScreen
      header={<FlowHeader title="Agendamento da mudança" onExitRequest={() => setExitOpen(true)} />}
      cta={
        <Button trackingId="confirmacao-confirmar" onClick={handleConfirmar}>
          Confirmar agendamento
        </Button>
      }
      overlay={
        <>
          <ExitConfirmSheet open={exitOpen} onClose={() => setExitOpen(false)} />
          <AlterarContatoSheet open={contatoSheetOpen} onClose={() => setContatoSheetOpen(false)} />
        </>
      }
    >
      <h1 className="mb-6 text-2xl font-semibold text-verde-escuro">
        Confira se está tudo certo com sua instalação
      </h1>
      <ConfirmationSummary
        onAlterarEndereco={() => router.push('/mudend/endereco')}
        onAlterarData={() => router.push('/mudend/agendamento')}
        onAlterarContato={() => setContatoSheetOpen(true)}
      />
    </FlowScreen>
  );
}
