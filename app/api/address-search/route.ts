import { NextResponse } from 'next/server';
import { isCepLike, type ViaCepResult } from '@/lib/viacep';
import type { EnderecoSugestao } from '@/lib/types';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
// Exigência de uso do Nominatim: identificar a aplicação num User-Agent válido.
const USER_AGENT = 'Nio-Prototype/1.0 (prototype@nio.com.br)';

/** Formata o retorno do ViaCEP como UM resultado no mesmo shape do Nominatim. */
function viaCepToSugestao(data: ViaCepResult): EnderecoSugestao {
  const displayName = [data.logradouro, data.bairro, data.localidade, data.uf]
    .filter(Boolean)
    .join(', ');

  return {
    place_id: Number(data.cep.replace(/\D/g, '')) || 0,
    display_name: displayName,
    address: {
      road: data.logradouro || undefined,
      house_number: null,
      suburb: data.bairro || undefined,
      city: data.localidade || undefined,
      state: data.uf || undefined,
      postcode: data.cep || undefined,
    },
  };
}

async function searchByCep(query: string): Promise<EnderecoSugestao[]> {
  const digits = query.replace(/\D/g, '');
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as ViaCepResult & { erro?: boolean };
    if (!data || data.erro) return [];
    return [viaCepToSugestao(data)];
  } catch {
    return [];
  }
}

async function searchByText(query: string): Promise<EnderecoSugestao[]> {
  const url =
    `${NOMINATIM_URL}?q=${encodeURIComponent(query)}` +
    '&countrycodes=br&format=json&addressdetails=1&limit=8&accept-language=pt-BR';

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('nominatim_unavailable');
  const data = await res.json();
  return Array.isArray(data) ? (data as EnderecoSugestao[]) : [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();

  if (q.length < 4) {
    return NextResponse.json([]);
  }

  try {
    const results = isCepLike(q) ? await searchByCep(q) : await searchByText(q);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: 'address_lookup_failed' }, { status: 502 });
  }
}
