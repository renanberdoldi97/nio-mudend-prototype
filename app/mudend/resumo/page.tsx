'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, exportEventsAsJSON } from '@/lib/tracking';
import { useMudendStore } from '@/lib/store';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { ConfirmationSummary } from '@/components/mudend/ConfirmationSummary';

export default function ResumoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const events = useMudendStore((state) => state.events);
  const sessionId = useMudendStore((state) => state.sessionId);
  const reset = useMudendStore((state) => state.reset);
  const [json, setJson] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setJson(exportEventsAsJSON());
  }, [events]);

  function handleCopy() {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Resumo (debug)" onBack={() => router.push('/')} />
      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 pt-2">
        <p className="mb-1 text-xs text-text-secondary">Sessão</p>
        <p className="mb-4 break-all font-mono text-xs text-verde-escuro">{sessionId}</p>

        <p className="mb-2 text-sm font-semibold text-verde-escuro">Formulário capturado</p>
        <ConfirmationSummary />

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
