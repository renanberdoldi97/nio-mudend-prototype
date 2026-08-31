import type { EnderecoSugestao } from './types';

const UF_BY_NAME: Record<string, string> = {
  acre: 'AC',
  alagoas: 'AL',
  amapá: 'AP',
  amazonas: 'AM',
  bahia: 'BA',
  ceará: 'CE',
  'distrito federal': 'DF',
  'espírito santo': 'ES',
  goiás: 'GO',
  maranhão: 'MA',
  'mato grosso': 'MT',
  'mato grosso do sul': 'MS',
  'minas gerais': 'MG',
  pará: 'PA',
  paraíba: 'PB',
  paraná: 'PR',
  pernambuco: 'PE',
  piauí: 'PI',
  'rio de janeiro': 'RJ',
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  rondônia: 'RO',
  roraima: 'RR',
  'santa catarina': 'SC',
  'são paulo': 'SP',
  sergipe: 'SE',
  tocantins: 'TO',
};

/** "São Paulo" → "SP"; "SP" → "SP"; vazio → "". */
export function toUf(state?: string | null): string {
  if (!state) return '';
  const t = state.trim();
  if (/^[A-Za-z]{2}$/.test(t)) return t.toUpperCase();
  return UF_BY_NAME[t.toLowerCase()] ?? t;
}

function via(s: EnderecoSugestao): string {
  const road = s.address?.road;
  const displayName = s.display_name ?? '';
  return road || displayName.split(',')[0]?.trim() || displayName;
}

/**
 * Primeira linha da sugestão (peso 600): "Rua X, 123" — ou só "Rua X" quando o
 * resultado não traz número. Se `road` vier vazio, usa o começo do display_name.
 */
export function formatSugestaoLinha(s: EnderecoSugestao): string {
  const numero = s.address?.house_number;
  return numero ? `${via(s)}, ${numero}` : via(s);
}

/**
 * Segunda linha da sugestão (peso 400, cor secundária):
 * "Bairro · Cidade/UF · CEP 00000-000". Campos vazios são omitidos e os
 * separadores ajustados.
 */
export function formatSugestaoDetalhe(s: EnderecoSugestao): string {
  const { suburb, neighbourhood, city, town, state, postcode } = s.address ?? {};
  const bairro = suburb || neighbourhood;
  const cidadeUf = [city || town, toUf(state)].filter(Boolean).join('/');

  return [bairro, cidadeUf || null, postcode ? `CEP ${postcode}` : null]
    .filter(Boolean)
    .join(' · ');
}

/**
 * Endereço selecionado no fluxo, já com o número informado à parte:
 * "R. Costa Barros, 2299, Bela Vista, São Paulo/SP".
 */
export function formatEnderecoSelecionado(
  s: EnderecoSugestao | null,
  numero: string,
  fallback: string
): string {
  if (!s) return fallback;
  const { suburb, neighbourhood, city, town, state } = s.address ?? {};
  const numeroFinal = s.address?.house_number || numero;
  const rua = numeroFinal ? `${via(s)}, ${numeroFinal}` : via(s);
  const bairro = suburb || neighbourhood;
  const cidadeUf = [city || town, toUf(state)].filter(Boolean).join('/');
  return [rua, bairro, cidadeUf].filter(Boolean).join(', ');
}

/**
 * Endereço atual do participante, no formato de duas linhas do card
 * "Seu endereço atual".
 */
export function formatEnderecoAtual(s: EnderecoSugestao): { eyebrow: string; linha: string } {
  const { suburb, neighbourhood, city, town, state, postcode, house_number } = s.address ?? {};
  const bairro = suburb || neighbourhood || '';
  const cidade = city || town || '';
  const uf = toUf(state);
  const cidadeUf = [cidade, uf].filter(Boolean).join('/');

  const eyebrow = [bairro, cidadeUf].filter(Boolean).join(' - ');
  const ruaNumero = [via(s), house_number].filter(Boolean).join(', ');
  const linha = [ruaNumero, cidadeUf, postcode ? `(${postcode})` : '']
    .filter(Boolean)
    .join(' ');

  return { eyebrow, linha };
}
