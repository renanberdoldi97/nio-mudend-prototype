import { NextResponse } from 'next/server';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
// Exigência de uso do Nominatim: identificar a aplicação num User-Agent válido.
const USER_AGENT = 'Nio-Prototype/1.0 (prototype@nio.com.br)';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();

  if (q.length < 4) {
    return NextResponse.json([]);
  }

  const url =
    `${NOMINATIM_URL}?q=${encodeURIComponent(q)}` +
    '&countrycodes=br&format=json&addressdetails=1&limit=8&accept-language=pt-BR';

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'nominatim_unavailable' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json({ error: 'nominatim_unreachable' }, { status: 502 });
  }
}
