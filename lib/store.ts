'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrackingEvent, Periodo, EnderecoSugestao } from './types';
import { CONTATO_MOCK } from './mock-data';

export function createSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type MudendData = {
  sessionId: string;
  startedAt: number;
  sessionCompleted: boolean;
  events: TrackingEvent[];
  novoEndereco: string;
  enderecoCepInfo: string | null;
  /** Sugestão escolhida no autocomplete. `null` = digitação livre (sem seleção). */
  enderecoSugestao: EnderecoSugestao | null;
  numero: string;
  complemento: string;
  complementoSkipped: boolean;
  dataAgendada: string | null;
  periodo: Periodo | null;
  nomeContato: string;
  telefoneContato: string;
  protocolo: string | null;
};

type MudendActions = {
  addEvent: (event: TrackingEvent) => void;
  updateNovoEndereco: (value: string) => void;
  setEnderecoCepInfo: (value: string | null) => void;
  setEnderecoSugestao: (value: EnderecoSugestao | null) => void;
  updateNumero: (value: string) => void;
  updateComplemento: (value: string) => void;
  setComplementoSkipped: (value: boolean) => void;
  setDataAgendada: (date: string | null) => void;
  setPeriodo: (periodo: Periodo | null) => void;
  updateTelefoneContato: (value: string) => void;
  setProtocolo: (value: string) => void;
  markSessionComplete: () => void;
  reset: () => void;
};

type MudendState = MudendData & MudendActions;

function createInitialData(sessionId: string): MudendData {
  return {
    sessionId,
    startedAt: Date.now(),
    sessionCompleted: false,
    events: [],
    novoEndereco: '',
    enderecoCepInfo: null,
    enderecoSugestao: null,
    numero: '',
    complemento: '',
    complementoSkipped: false,
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
      // String vazia no SSR e no primeiro paint do cliente (evita hydration
      // mismatch, já que crypto.randomUUID() geraria valores diferentes em
      // cada lado). O SessionInit preenche com um UUID de verdade assim que
      // monta no navegador — depois disso o persist mantém o mesmo id entre reloads.
      ...createInitialData(''),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateNovoEndereco: (novoEndereco) => set({ novoEndereco }),
      setEnderecoCepInfo: (enderecoCepInfo) => set({ enderecoCepInfo }),
      setEnderecoSugestao: (enderecoSugestao) => set({ enderecoSugestao }),
      updateNumero: (numero) => set({ numero }),
      updateComplemento: (complemento) => set({ complemento }),
      setComplementoSkipped: (complementoSkipped) => set({ complementoSkipped }),
      setDataAgendada: (dataAgendada) => set({ dataAgendada }),
      setPeriodo: (periodo) => set({ periodo }),
      updateTelefoneContato: (telefoneContato) => set({ telefoneContato }),
      setProtocolo: (protocolo) => set({ protocolo }),
      markSessionComplete: () => set({ sessionCompleted: true }),
      reset: () => set(createInitialData(createSessionId())),
    }),
    {
      name: 'nio-mudend-state',
      // Evita ler o localStorage automaticamente na criação da store (isso
      // aconteceria antes do React hidratar e causaria mismatch entre
      // servidor e cliente pra quem já tem sessão salva). SessionInit chama
      // rehydrate() manualmente depois do mount.
      skipHydration: true,
    }
  )
);
