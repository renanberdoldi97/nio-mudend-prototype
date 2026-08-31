export type TrackingEventType =
  | 'screen_view'
  | 'screen_leave'
  | 'element_click'
  | 'form_input'
  | 'calendar_click'
  | 'calendar_click_blocked'
  | 'complement_skipped'
  | 'checkbox_toggle'
  | 'bottom_sheet_open'
  | 'bottom_sheet_close'
  | 'session_complete'
  | 'session_abandon';

export type TrackingEvent = {
  type: TrackingEventType;
  timestamp: number;
  screen: string;
  element_id?: string;
  metadata?: Record<string, unknown>;
};

export type Periodo = 'manha' | 'tarde';

export type EnderecoSugestao = {
  id: string;
  logradouro: string;
  /** Presente só quando o endereço já vem com número. */
  numero?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
};

/** Estado do campo de endereço com autocomplete. */
export type EnderecoState = 'idle' | 'typing' | 'selected';
