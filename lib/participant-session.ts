'use client';

import { useCallback, useEffect, useState } from 'react';
import type { EnderecoSugestao } from './types';

const STORAGE_KEY = 'participantSession';

export type ParticipantSession = {
  name: string;
  phone: string;
  /** Resultado do autocomplete escolhido no onboarding. */
  currentAddress: EnderecoSugestao;
  sessionId: string;
  startedAt: number;
};

export function createParticipantSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `participant-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function readParticipantSession(): ParticipantSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ParticipantSession>;
    if (!parsed || !parsed.name || !parsed.phone || !parsed.currentAddress) return null;
    return parsed as ParticipantSession;
  } catch {
    return null;
  }
}

export function writeParticipantSession(session: ParticipantSession): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    // Notifica a própria aba (o evento nativo `storage` só dispara em outras abas).
    window.dispatchEvent(new Event('participant-session-change'));
  } catch {
    /* localStorage indisponível — protótipo segue sem persistência */
  }
}

export function clearParticipantSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('participant-session-change'));
  } catch {
    /* noop */
  }
}

type UseParticipantSession = {
  session: ParticipantSession | null;
  /** true depois da primeira leitura do localStorage (evita flash de estado errado). */
  loaded: boolean;
  resetSession: () => void;
};

export function useParticipantSession(): UseParticipantSession {
  const [session, setSession] = useState<ParticipantSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setSession(readParticipantSession());
    sync();
    setLoaded(true);
    window.addEventListener('storage', sync);
    window.addEventListener('participant-session-change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('participant-session-change', sync);
    };
  }, []);

  const resetSession = useCallback(() => {
    clearParticipantSession();
    setSession(null);
  }, []);

  return { session, loaded, resetSession };
}
