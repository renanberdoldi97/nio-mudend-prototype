'use client';

import { useEffect } from 'react';
import { useMudendStore } from './store';
import type { TrackingEvent, TrackingEventType } from './types';

// Persistência em localStorage acontece automaticamente via o middleware
// `persist` do lib/store.ts — toda chamada de addEvent já grava o estado inteiro.

export function createEvent(
  type: TrackingEventType,
  screen: string,
  elementId?: string,
  metadata?: Record<string, unknown>
): TrackingEvent {
  return {
    type,
    timestamp: Date.now(),
    screen,
    ...(elementId ? { element_id: elementId } : {}),
    ...(metadata ? { metadata } : {}),
  };
}

export function trackEvent(
  type: TrackingEventType,
  screen: string,
  elementId?: string,
  metadata?: Record<string, unknown>
): TrackingEvent {
  const event = createEvent(type, screen, elementId, metadata);
  useMudendStore.getState().addEvent(event);
  return event;
}

export type SessionExport = {
  sessionId: string;
  startedAt: number;
  sessionCompleted: boolean;
  events: ReturnType<typeof useMudendStore.getState>['events'];
  form: {
    novoEndereco: string;
    enderecoCepInfo: string | null;
    numero: string;
    complemento: string;
    complementoSkipped: boolean;
    dataAgendada: string | null;
    periodo: string | null;
    nomeContato: string;
    telefoneContato: string;
    protocolo: string | null;
  };
};

export function buildSessionExport(): SessionExport {
  const state = useMudendStore.getState();
  return {
    sessionId: state.sessionId,
    startedAt: state.startedAt,
    sessionCompleted: state.sessionCompleted,
    events: state.events,
    form: {
      novoEndereco: state.novoEndereco,
      enderecoCepInfo: state.enderecoCepInfo,
      numero: state.numero,
      complemento: state.complemento,
      complementoSkipped: state.complementoSkipped,
      dataAgendada: state.dataAgendada,
      periodo: state.periodo,
      nomeContato: state.nomeContato,
      telefoneContato: state.telefoneContato,
      protocolo: state.protocolo,
    },
  };
}

export function exportEventsAsJSON(): string {
  return JSON.stringify(buildSessionExport(), null, 2);
}

export function useTrackScreen(screen: string) {
  useEffect(() => {
    trackEvent('screen_view', screen);
    return () => {
      trackEvent('screen_leave', screen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);
}

let abandonListenerRegistered = false;

export function registerSessionAbandonListener() {
  if (abandonListenerRegistered || typeof window === 'undefined') return;
  abandonListenerRegistered = true;

  window.addEventListener('beforeunload', () => {
    const state = useMudendStore.getState();
    if (!state.sessionCompleted) {
      state.addEvent(createEvent('session_abandon', window.location.pathname));
    }
  });
}
