export type TrackingEventType =
  | 'screen_view'
  | 'screen_leave'
  | 'element_click'
  | 'dead_click'
  | 'form_input'
  | 'calendar_click'
  | 'calendar_click_blocked'
  | 'complement_skipped'
  | 'cep_suggestion_shown'
  | 'cep_suggestion_selected'
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

/**
 * Campos de `address` que o Nominatim devolve com `addressdetails=1`. O proxy
 * ViaCEP reaproveita o mesmo formato (com `house_number: null`, já que o CEP
 * não traz número).
 */
export type NominatimAddress = {
  road?: string;
  house_number?: string | null;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  state?: string;
  postcode?: string;
};

/** Um resultado bruto do autocomplete do Nominatim (OpenStreetMap). */
export type EnderecoSugestao = {
  place_id: number;
  display_name: string;
  lat?: string;
  lon?: string;
  address: NominatimAddress;
};

/** Estado do campo de endereço com autocomplete. */
export type EnderecoState = 'idle' | 'typing' | 'selected';
