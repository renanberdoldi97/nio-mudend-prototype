import { NextResponse } from 'next/server';

type Participant = {
  name?: string;
  phone?: string;
  currentAddress?: { display_name?: string; address?: Record<string, unknown> } | null;
  startedAt?: number;
} | null;

type Body = {
  session?: {
    mudendSessionId?: string;
    participant?: Participant;
  } | null;
  form?: Record<string, unknown> | null;
  events?: unknown[] | null;
};

function str(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return '```json\n' + JSON.stringify(value, null, 2).slice(0, 900) + '\n```';
  return String(value);
}

function currentAddressLabel(participant: Participant): string {
  const addr = participant?.currentAddress;
  if (!addr) return '—';
  return addr.display_name || str(addr.address);
}

function toDiscordPayload(body: Body) {
  const { session, form, events } = body;
  const participant = session?.participant ?? null;
  return {
    embeds: [
      {
        title: 'Nova sessão de teste — MUDEND',
        color: 0x124803,
        timestamp: new Date().toISOString(),
        fields: [
          { name: 'Participante', value: str(participant?.name), inline: true },
          { name: 'Celular', value: str(participant?.phone), inline: true },
          { name: 'mudendSessionId', value: str(session?.mudendSessionId) },
          { name: 'Endereço atual', value: currentAddressLabel(participant) },
          {
            name: 'Novo endereço',
            value: str(
              [form?.novoEndereco, form?.numero].filter(Boolean).join(', ') || null
            ),
          },
          {
            name: 'Complemento',
            value: form?.complementoSkipped ? 'Sem complemento' : str(form?.complemento),
            inline: true,
          },
          { name: 'Data', value: str(form?.dataAgendada), inline: true },
          { name: 'Período', value: str(form?.periodo), inline: true },
          { name: 'Contato preferencial', value: str(form?.telefoneContato), inline: true },
          { name: 'Protocolo', value: str(form?.protocolo), inline: true },
          {
            name: 'Eventos capturados',
            value: String(Array.isArray(events) ? events.length : 0),
            inline: true,
          },
        ],
      },
    ],
  };
}

export async function POST(request: Request) {
  const webhookUrl = process.env.SESSION_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 500 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const raw = process.env.SESSION_WEBHOOK_FORMAT === 'raw';
  const payload = raw
    ? { session: body.session, form: body.form, events: body.events }
    : toDiscordPayload(body);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'webhook_failed', status: res.status }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'webhook_unreachable' }, { status: 500 });
  }
}
