'use client';

import { NioIcon, type IconName } from '@/components/icons';
import { useMudendStore } from '@/lib/store';
import { formatDataComDiaSemana } from '@/lib/utils';

const PERIODO_LABEL: Record<string, string> = {
  manha: 'Manhã (8:00 - 12:00)',
  tarde: 'Tarde (14:00 - 18:00)',
};

function Row({
  icon,
  children,
  onAlterar,
}: {
  icon: IconName;
  children: React.ReactNode;
  onAlterar: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-4">
      <div className="flex items-start gap-3">
        <NioIcon name={icon} size={20} className="mt-0.5" />
        <div>{children}</div>
      </div>
      <button
        type="button"
        onClick={onAlterar}
        className="shrink-0 text-sm font-semibold text-primary-background"
      >
        Alterar
      </button>
    </div>
  );
}

type ConfirmationSummaryProps = {
  onAlterarEndereco: () => void;
  onAlterarData: () => void;
  onAlterarContato: () => void;
};

export function ConfirmationSummary({
  onAlterarEndereco,
  onAlterarData,
  onAlterarContato,
}: ConfirmationSummaryProps) {
  const novoEndereco = useMudendStore((state) => state.novoEndereco);
  const complemento = useMudendStore((state) => state.complemento);
  const dataAgendada = useMudendStore((state) => state.dataAgendada);
  const periodo = useMudendStore((state) => state.periodo);
  const telefoneContato = useMudendStore((state) => state.telefoneContato);

  const enderecoCompleto = [novoEndereco, complemento].filter(Boolean).join(' - ');

  return (
    <div className="divide-y divide-border">
      <Row icon="location" onAlterar={onAlterarEndereco}>
        <p className="text-xs text-text-secondary">Novo endereço</p>
        <p className="text-sm font-medium text-verde-escuro">{enderecoCompleto || '—'}</p>
      </Row>
      <Row icon="calendar" onAlterar={onAlterarData}>
        <p className="text-xs text-text-secondary">Data</p>
        <p className="text-sm font-medium text-verde-escuro">
          {dataAgendada ? formatDataComDiaSemana(dataAgendada) : '—'}
        </p>
        <p className="mt-2 text-xs text-text-secondary">Período</p>
        <p className="text-sm font-medium text-verde-escuro">{periodo ? PERIODO_LABEL[periodo] : '—'}</p>
      </Row>
      <Row icon="call" onAlterar={onAlterarContato}>
        <p className="text-xs text-text-secondary">Contato preferencial</p>
        <p className="text-sm font-medium text-verde-escuro">{telefoneContato}</p>
      </Row>
    </div>
  );
}
