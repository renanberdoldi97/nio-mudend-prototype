'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrackingEvent, Periodo } from './types';
import { CONTATO_MOCK } from './mock-data';

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type MudendData = {
  sessionId: string;
  startedAt: number;
  sessionCompleted: boolean;
  events: TrackingEvent[];
  novoEndereco: string;
  complemento: string;
  dataAgendada: string | null;
  periodo: Periodo | null;
  nomeContato: string;
  telefoneContato: string;
  protocolo: string | null;
};

type MudendActions = {
  addEvent: (event: TrackingEvent) => void;
  updateNovoEndereco: (value: string) => void;
  updateComplemento: (value: string) => void;
  setDataAgendada: (date: string | null) => void;
  setPeriodo: (periodo: Periodo | null) => void;
  updateTelefoneContato: (value: string) => void;
  setProtocolo: (value: string) => void;
  markSessionComplete: () => void;
  reset: () => void;
};

type MudendState = MudendData & MudendActions;

function createInitialData(): MudendData {
  return {
    sessionId: createSessionId(),
    startedAt: Date.now(),
    sessionCompleted: false,
    events: [],
    novoEndereco: '',
    complemento: '',
    dataAgendada: null,
    periodo: null,
    nomeContato: CONTATO_MOCK.nome,
    telefoneContato: CONTATO_MOCK.telefone,
    protocolo: null,
  };
}

export const useMudendStore = create<MudendState>()(
  persist(
    (set) => ({
      ...createInitialData(),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateNovoEndereco: (novoEndereco) => set({ novoEndereco }),
      updateComplemento: (complemento) => set({ complemento }),
      setDataAgendada: (dataAgendada) => set({ dataAgendada }),
      setPeriodo: (periodo) => set({ periodo }),
      updateTelefoneContato: (telefoneContato) => set({ telefoneContato }),
      setProtocolo: (protocolo) => set({ protocolo }),
      markSessionComplete: () => set({ sessionCompleted: true }),
      reset: () => set(createInitialData()),
    }),
    { name: 'nio-mudend-state' }
  )
);
