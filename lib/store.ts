'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrackingEvent, Endereco, Contato, Periodo } from './types';

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const emptyEndereco: Endereco = { cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' };
const emptyContato: Contato = { nome: '', telefone: '', email: '' };

type MudendData = {
  sessionId: string;
  startedAt: number;
  sessionCompleted: boolean;
  events: TrackingEvent[];
  endereco: Endereco;
  complemento: string;
  dataAgendada: string | null;
  periodo: Periodo | null;
  contato: Contato;
};

type MudendActions = {
  addEvent: (event: TrackingEvent) => void;
  updateEndereco: (endereco: Partial<Endereco>) => void;
  updateComplemento: (complemento: string) => void;
  setDataAgendada: (date: string | null) => void;
  setPeriodo: (periodo: Periodo | null) => void;
  updateContato: (contato: Partial<Contato>) => void;
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
    endereco: emptyEndereco,
    complemento: '',
    dataAgendada: null,
    periodo: null,
    contato: emptyContato,
  };
}

export const useMudendStore = create<MudendState>()(
  persist(
    (set) => ({
      ...createInitialData(),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEndereco: (endereco) =>
        set((state) => ({ endereco: { ...state.endereco, ...endereco } })),
      updateComplemento: (complemento) => set({ complemento }),
      setDataAgendada: (dataAgendada) => set({ dataAgendada }),
      setPeriodo: (periodo) => set({ periodo }),
      updateContato: (contato) => set((state) => ({ contato: { ...state.contato, ...contato } })),
      markSessionComplete: () => set({ sessionCompleted: true }),
      reset: () => set(createInitialData()),
    }),
    { name: 'nio-mudend-state' }
  )
);
