'use client';

import { useMudendStore } from '@/lib/store';
import { formatDataComDiaSemana } from '@/lib/utils';
import { formatEnderecoSelecionado } from '@/lib/address';

const PERIODO_LABEL: Record<string, string> = {
  manha: 'Manhã (8:00 - 12:00)',
  tarde: 'Tarde (14:00 - 18:00)',
};

function PinOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M12 21C12 21 19 14.7 19 9.6C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.6C5 14.7 12 21 12 21Z"
        stroke="#192B1C"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.6" r="2.4" stroke="#192B1C" strokeWidth="1.6" />
    </svg>
  );
}

function CalendarOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="#192B1C" strokeWidth="1.6" />
      <path d="M4 10.5H20" stroke="#192B1C" strokeWidth="1.6" />
      <path d="M8 3.5V7" stroke="#192B1C" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 3.5V7" stroke="#192B1C" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PhoneOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M8 4C8 4 10 4.2 11 6.3C11.5 7.4 10.4 8.3 9.8 8.8C10.4 11 12.9 13.5 15.2 14.2C15.7 13.6 16.6 12.5 17.7 13C19.8 14 20 16 20 16C20 17.7 18.3 19.5 16.5 19.5C10.7 19.5 4.5 13.3 4.5 7.5C4.5 5.7 6.3 4 8 4Z"
        stroke="#192B1C"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Row({
  icon,
  children,
  onAlterar,
}: {
  icon: () => React.ReactNode;
  children: React.ReactNode;
  onAlterar: () => void;
}) {
  const Icon = icon;
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5">
          <Icon />
        </span>
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
  const numero = useMudendStore((state) => state.numero);
  const enderecoSugestao = useMudendStore((state) => state.enderecoSugestao);
  const dataAgendada = useMudendStore((state) => state.dataAgendada);
  const periodo = useMudendStore((state) => state.periodo);
  const telefoneContato = useMudendStore((state) => state.telefoneContato);

  const enderecoCompleto = formatEnderecoSelecionado(enderecoSugestao, numero, novoEndereco);

  return (
    <div className="flex flex-col gap-6">
      <Row icon={PinOutlineIcon} onAlterar={onAlterarEndereco}>
        <p className="text-xs text-text-secondary">Novo endereço</p>
        <p className="text-sm font-medium text-text-primary">{enderecoCompleto || '—'}</p>
      </Row>
      <Row icon={CalendarOutlineIcon} onAlterar={onAlterarData}>
        <p className="text-xs text-text-secondary">Data</p>
        <p className="text-sm font-medium text-text-primary">
          {dataAgendada ? formatDataComDiaSemana(dataAgendada) : '—'}
        </p>
        <p className="mt-3 text-xs text-text-secondary">Período</p>
        <p className="text-sm font-medium text-text-primary">{periodo ? PERIODO_LABEL[periodo] : '—'}</p>
      </Row>
      <Row icon={PhoneOutlineIcon} onAlterar={onAlterarContato}>
        <p className="text-xs text-text-secondary">Contato preferencial</p>
        <p className="text-sm font-medium text-text-primary">{telefoneContato}</p>
      </Row>
    </div>
  );
}
