'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTrackScreen, trackEvent, buildSessionExport } from '@/lib/tracking';
import { useParticipantSession } from '@/lib/participant-session';
import { Button } from '@/components/ui/Button';

type SendState = 'loading' | 'success' | 'error';

export default function SessaoConcluidaPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const { session } = useParticipantSession();

  const [state, setState] = useState<SendState>('loading');
  const payloadRef = useRef<Record<string, unknown> | null>(null);
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const exportData = buildSessionExport();
    const payload = {
      session: session
        ? { ...session, mudendSessionId: exportData.sessionId }
        : { mudendSessionId: exportData.sessionId },
      form: exportData.form,
      events: exportData.events,
    };
    payloadRef.current = payload;

    (async () => {
      try {
        const res = await fetch('/api/submit-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('submit_failed');
        setState('success');
        trackEvent('element_click', pathname, 'sessao-enviada', { status: 'ok' });
      } catch {
        setState('error');
        trackEvent('element_click', pathname, 'sessao-enviada', { status: 'erro' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDownload() {
    const data = payloadRef.current ?? buildSessionExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessao-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    trackEvent('element_click', pathname, 'sessao-baixar-arquivo');
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-white px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-background">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
          <path
            d="M5 12.5L9.5 17L19 6.5"
            stroke="#124803"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h1 className="mt-6 text-2xl font-bold text-verde-escuro">Obrigado por participar!</h1>
      <p className="mt-3 text-sm text-text-secondary">
        Estamos enviando os dados da sua sessão.
      </p>

      <div className="mt-8 min-h-[96px]">
        {state === 'loading' && (
          <div className="flex flex-col items-center gap-3">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary-background" />
            <p className="text-sm text-text-secondary">Enviando...</p>
          </div>
        )}

        {state === 'success' && (
          <p className="text-sm font-medium text-verde-escuro">
            Tudo certo! Você já pode encerrar.
          </p>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-text-primary">
              Não foi possível enviar automaticamente.
            </p>
            <Button
              variant="secondary"
              fullWidth={false}
              trackingId="sessao-baixar-arquivo-btn"
              onClick={handleDownload}
            >
              Baixar arquivo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
