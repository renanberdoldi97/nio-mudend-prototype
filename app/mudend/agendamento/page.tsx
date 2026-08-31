'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen } from '@/lib/tracking';
import { FlowHeader } from '@/components/ui/FlowHeader';
import { FlowScreen } from '@/components/ui/FlowScreen';
import { ExitConfirmSheet } from '@/components/ui/ExitConfirmSheet';
import { Calendar } from '@/components/mudend/Calendar';
import { PeriodSelector } from '@/components/mudend/PeriodSelector';
import { Button } from '@/components/ui/Button';
import { NioIcon } from '@/components/icons';
import { useMudendStore } from '@/lib/store';
import { formatDataExtenso } from '@/lib/utils';

export default function AgendamentoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const [exitOpen, setExitOpen] = useState(false);

  const dataAgendada = useMudendStore((state) => state.dataAgendada);
  const setDataAgendada = useMudendStore((state) => state.setDataAgendada);
  const periodo = useMudendStore((state) => state.periodo);
  const setPeriodo = useMudendStore((state) => state.setPeriodo);

  const isValid = Boolean(dataAgendada && periodo);

  return (
    <FlowScreen
      header={<FlowHeader title="Agendamento da mudança" onExitRequest={() => setExitOpen(true)} />}
      cta={
        <Button
          trackingId="agendamento-continuar"
          disabled={!isValid}
          onClick={() => router.push('/mudend/confirmacao')}
        >
          Continuar
        </Button>
      }
      overlay={<ExitConfirmSheet open={exitOpen} onClose={() => setExitOpen(false)} />}
    >
      <span className="mb-3 flex h-8 w-8 items-center justify-center">
        <NioIcon name="calendar" size={24} />
      </span>
      <h1 className="mb-1 text-2xl font-semibold text-verde-escuro">Agendamento</h1>
      <p className="mb-4 text-sm text-text-secondary">A mudança vai ser agendada pra:</p>

      <Calendar selectedDate={dataAgendada} onSelect={setDataAgendada} />

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-verde-escuro">Períodos disponíveis</p>
        <PeriodSelector value={periodo} onChange={setPeriodo} disabled={!dataAgendada} />
      </div>

      {isValid && dataAgendada && (
        <div className="mt-4 rounded-xl bg-verde-claro px-4 py-3 text-center text-sm">
          <span className="text-text-secondary">Selecionado: </span>
          <span className="font-semibold text-verde-escuro">{formatDataExtenso(dataAgendada)}</span>
        </div>
      )}
    </FlowScreen>
  );
}
