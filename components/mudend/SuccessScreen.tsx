'use client';

import { useMudendStore } from '@/lib/store';
import { formatDataExtenso } from '@/lib/utils';
import type { Periodo } from '@/lib/types';

const PERIODO_HORARIO: Record<Periodo, [string, string]> = {
  manha: ['08:00', '12:00'],
  tarde: ['14:00', '18:00'],
};

export function SuccessDetails() {
  const novoEndereco = useMudendStore((state) => state.novoEndereco);
  const complemento = useMudendStore((state) => state.complemento);
  const dataAgendada = useMudendStore((state) => state.dataAgendada);
  const periodo = useMudendStore((state) => state.periodo);
  const telefoneContato = useMudendStore((state) => state.telefoneContato);
  const protocolo = useMudendStore((state) => state.protocolo);

  const enderecoCompleto = [novoEndereco, complemento].filter(Boolean).join(' - ');
  const dataLabel = dataAgendada ? formatDataExtenso(dataAgendada) : '';
  const [horaInicio, horaFim] = periodo ? PERIODO_HORARIO[periodo] : ['', ''];

  return (
    <>
      <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-verde-neon">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M5 12.5L9.5 17L19 6.5"
            stroke="#124803"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <h1 className="mb-3 text-2xl font-semibold text-verde-escuro">Mudança agendada com sucesso!</h1>
      <p className="mb-6 text-sm text-text-secondary">
        A instalação acontecerá no dia {dataLabel}, entre {horaInicio} - {horaFim}, no endereço:{' '}
        {enderecoCompleto}.
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-text-secondary">Protocolo</p>
          <p className="text-sm font-medium text-verde-escuro">{protocolo}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Data</p>
          <p className="text-sm font-medium text-verde-escuro">{dataLabel}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Hora</p>
          <p className="text-sm font-medium text-verde-escuro">
            {horaInicio} - {horaFim}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Contato preferencial</p>
          <p className="text-sm font-medium text-verde-escuro">{telefoneContato}</p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-[#FFF6D6] p-3">
        <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-4 w-4 shrink-0">
          <path d="M10 2L18 17H2L10 2Z" stroke="#8A6D00" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M10 8V11" stroke="#8A6D00" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="10" cy="13.5" r="0.75" fill="#8A6D00" />
        </svg>
        <p className="text-xs text-[#6B5300]">Lembre-se de levar seu roteador para o novo endereço.</p>
      </div>
    </>
  );
}
