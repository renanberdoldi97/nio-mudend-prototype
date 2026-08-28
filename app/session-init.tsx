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
    });
  }, []);

  return null;
}
