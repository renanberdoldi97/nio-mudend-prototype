'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrackingEvent, Periodo, EnderecoSugestao } from './types';
import { readParticipantSession } from './participant-session';

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
  /** Copia nome/telefone da participantSession pra dentro do formulário (sem sobrescrever edições). */
  hydrateContatoFromParticipant: () => void;
  setProtocolo: (value: string) => void;
  markSessionComplete: () => void;
  reset: () => void;
};

type MudendState = MudendData & MudendActions;

type ContatoInicial = { nome?: string; telefone?: string } | null;

function createInitialData(sessionId: string, contato: ContatoInicial = null): MudendData {
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
    // Sem dados fake: nome/telefone vêm da participantSession (onboarding) ou
    // ficam vazios até o participante preencher.
    nomeContato: contato?.nome ?? '',
    telefoneContato: contato?.telefone ?? '',
    protocolo: null,
  };
}

export const useMudendStore = create<MudendState>()(
  persist(
    (set, get) => ({
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
      hydrateContatoFromParticipant: () => {
        const participant = readParticipantSession();
        if (!participant) return;
        const { nomeContato, telefoneContato } = get();
        set({
          nomeContato: nomeContato || participant.name,
          telefoneContato: telefoneContato || participant.phone,
        });
      },
      setProtocolo: (protocolo) => set({ protocolo }),
      markSessionComplete: () => set({ sessionCompleted: true }),
      reset: () => {
        const participant = readParticipantSession();
        set(
          createInitialData(createSessionId(), {
            nome: participant?.name,
            telefone: participant?.phone,
          })
        );
      },
    }),
    {
      name: 'nio-mudend-state',
      // Evita ler o localStorage automaticamente na criação da store (isso
      // aconteceria antes do React hidratar e causaria mismatch entre
      // servidor e cliente pra quem já tem sessão salva). SessionInit chama
      // rehydrate() manualmente depois do mount e, na sequência,
      // hydrateContatoFromParticipant().
      skipHydration: true,
    }
  )
);
