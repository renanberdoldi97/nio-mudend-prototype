'use client';

import { useMudendStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { formatDateLabel } from '@/lib/utils';

const PERIODO_LABEL: Record<string, string> = {
  manha: 'Manhã (08:00 – 12:00)',
  tarde: 'Tarde (13:00 – 18:00)',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="text-right font-medium text-verde-escuro">{value || '—'}</span>
    </div>
  );
}

export function ConfirmationSummary() {
  const endereco = useMudendStore((state) => state.endereco);
  const complemento = useMudendStore((state) => state.complemento);
  const dataAgendada = useMudendStore((state) => state.dataAgendada);
  const periodo = useMudendStore((state) => state.periodo);
  const contato = useMudendStore((state) => state.contato);

  const enderecoCompleto = [
    `${endereco.rua}, ${endereco.numero}`,
    complemento,
    endereco.bairro,
    `${endereco.cidade}/${endereco.estado}`,
  ]
    .filter(Boolean)
    .join(' — ');

  const dataLabel = dataAgendada ? formatDateLabel(new Date(dataAgendada)) : '';

  return (
    <Card variant="white" padding="md">
      <Row label="Novo endereço" value={enderecoCompleto} />
      <Row label="CEP" value={endereco.cep} />
      <Row label="Data" value={dataLabel} />
      <Row label="Período" value={periodo ? PERIODO_LABEL[periodo] : ''} />
      <Row label="Contato" value={contato.nome} />
      <Row label="Telefone" value={contato.telefone} />
      <Row label="E-mail" value={contato.email} />
    </Card>
  );
}
