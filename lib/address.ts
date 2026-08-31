import type { EnderecoSugestao } from './types';

/**
 * Primeira linha da sugestão (peso 600): "Rua X, 123" — ou só "Rua X" quando o
 * resultado não traz número. Se `road` vier vazio, usa o começo do display_name.
 */
export function formatSugestaoLinha(s: EnderecoSugestao): string {
  const { road, house_number } = s.address ?? {};
  const displayName = s.display_name ?? '';
  const via = road || displayName.split(',')[0]?.trim() || displayName;
  return house_number ? `${via}, ${house_number}` : via;
}

/**
 * Segunda linha da sugestão (peso 400, cor secundária):
 * "Bairro · Cidade/UF · CEP 00000-000". Campos vazios são omitidos e os
 * separadores ajustados.
 */
export function formatSugestaoDetalhe(s: EnderecoSugestao): string {
  const { suburb, neighbourhood, city, town, state, postcode } = s.address ?? {};
  const bairro = suburb || neighbourhood;
  const municipio = city || town;
  const cidadeUf = [municipio, state].filter(Boolean).join('/');

  return [bairro, cidadeUf || null, postcode ? `CEP ${postcode}` : null]
    .filter(Boolean)
    .join(' · ');
}
