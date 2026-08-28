'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, exportEventsAsJSON } from '@/lib/tracking';
import { useMudendStore } from '@/lib/store';
import { FlowHeader } from '@/components/ui/FlowHeader';
import { Button } from '@/components/ui/Button';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm last:border-b-0">
      <span className="text-text-secondary">{label}</span>
      <span className="text-right font-medium text-verde-escuro">{value || '—'}</span>
    </div>
  );
}

export default function ResumoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const events = useMudendStore((state) => state.events);
  const sessionId = useMudendStore((state) => state.sessionId);
  const novoEndereco = useMudendStore((state) => state.novoEndereco);
  const numero = useMudendStore((state) => state.numero);
  const complemento = useMudendStore((state) => state.complemento);
  const complementoSkipped = useMudendStore((state) => state.complementoSkipped);
  const dataAgendada = useMudendStore((state) => state.dataAgendada);
  const periodo = useMudendStore((state) => state.periodo);
  const nomeContato = useMudendStore((state) => state.nomeContato);
  const telefoneContato = useMudendStore((state) => state.telefoneContato);
  const protocolo = useMudendStore((state) => state.protocolo);
  const reset = useMudendStore((state) => state.reset);
  const [json, setJson] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setJson(exportEventsAsJSON());
  }, [events, sessionId]);

  function handleCopy() {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex h-full flex-col">
      <FlowHeader title="Resumo (debug)" rightAction="none" onBack={() => router.push('/')} />
      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 pt-2">
        <p className="mb-1 text-xs text-text-secondary">Sessão</p>
        <p className="mb-4 break-all font-mono text-xs text-verde-escuro">{sessionId}</p>

        <p className="mb-2 text-sm font-semibold text-verde-escuro">Formulário capturado</p>
        <div className="rounded-2xl border border-border bg-white px-4">
          <Row label="Novo endereço" value={novoEndereco} />
          <Row label="Número" value={numero} />
          <Row label="Complemento" value={complementoSkipped ? 'Sem complemento' : complemento} />
          <Row label="Data" value={dataAgendada ?? ''} />
          <Row label="Período" value={periodo ?? ''} />
          <Row label="Nome contato" value={nomeContato} />
          <Row label="Telefone contato" value={telefoneContato} />
          <Row label="Protocolo" value={protocolo ?? ''} />
        </div>

        <p className="mb-2 mt-6 text-sm font-semibold text-verde-escuro">
          Eventos capturados ({events.length})
        </p>
        <pre className="max-h-80 overflow-auto rounded-lg bg-verde-escuro p-3 text-[10px] leading-relaxed text-lima">
          {json}
        </pre>

        <div className="mt-4 flex flex-col gap-2">
          <Button variant="secondary" onClick={handleCopy}>
            {copied ? 'Copiado!' : 'Copiar JSON'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              router.push('/');
            }}
          >
            Reiniciar sessão de teste
          </Button>
        </div>
      </main>
    </div>
  );
}
