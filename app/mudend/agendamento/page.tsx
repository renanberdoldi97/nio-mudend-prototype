'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { JourneyLayout } from '@/components/ui/JourneyLayout';
import { Calendar } from '@/components/mudend/Calendar';
import { PeriodSelector } from '@/components/mudend/PeriodSelector';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useMudendStore } from '@/lib/store';

export default function AgendamentoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const dataAgendada = useMudendStore((state) => state.dataAgendada);
  const setDataAgendada = useMudendStore((state) => state.setDataAgendada);
  const periodo = useMudendStore((state) => state.periodo);
  const setPeriodo = useMudendStore((state) => state.setPeriodo);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isValid = Boolean(dataAgendada && periodo);

  return (
    <JourneyLayout
      title="Agendar mudança"
      cta={
        <Button
          trackingId="agendamento-continuar"
          disabled={!isValid}
          onClick={() => router.push('/mudend/confirmacao')}
        >
          Continuar
        </Button>
      }
      overlay={
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          sheetId="agendamento-info"
          title="Como funciona a visita técnica"
        >
          <p className="text-sm text-text-secondary">
            Um técnico Nio vai até o novo endereço no período escolhido para reinstalar sua
            internet. A visita costuma durar entre 40 e 60 minutos.
          </p>
        </BottomSheet>
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-text-secondary">Escolha o melhor dia</p>
        <button
          type="button"
          onClick={() => {
            trackEvent('element_click', pathname, 'agendamento-info-button');
            setSheetOpen(true);
          }}
          className="text-xs font-medium text-primary-background underline"
        >
          Como funciona?
        </button>
      </div>
      <Calendar selectedDate={dataAgendada} onSelect={setDataAgendada} />

      <p className="mb-3 mt-6 text-sm text-text-secondary">Escolha o período</p>
      <PeriodSelector value={periodo} onChange={setPeriodo} />
    </JourneyLayout>
  );
}
