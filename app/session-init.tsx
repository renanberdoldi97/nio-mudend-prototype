'use client';

import { useEffect } from 'react';
import { registerSessionAbandonListener } from '@/lib/tracking';
import { useMudendStore, createSessionId } from '@/lib/store';

export function SessionInit() {
  useEffect(() => {
    registerSessionAbandonListener();

    // skipHydration: true na store — precisa reidratar manualmente aqui,
    // já no navegador, depois que o React já hidratou com o estado vazio
    // do SSR (evita mismatch pra quem já tem sessão salva no localStorage).
    Promise.resolve(useMudendStore.persist.rehydrate()).then(() => {
      if (!useMudendStore.getState().sessionId) {
        useMudendStore.setState({ sessionId: createSessionId() });
      }
      // Copia nome/telefone da participantSession pro formulário (só preenche
      // o que estiver vazio — não sobrescreve edições feitas no fluxo).
      useMudendStore.getState().hydrateContatoFromParticipant();
    });

    // Se a participantSession for criada/limpa depois (onboarding, "Nova sessão"),
    // reflete no formulário.
    const sync = () => useMudendStore.getState().hydrateContatoFromParticipant();
    window.addEventListener('participant-session-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('participant-session-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return null;
}
