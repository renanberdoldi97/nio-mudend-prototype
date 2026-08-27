'use client';

import { useMudendStore } from '@/lib/store';
import { Input } from '@/components/ui/Input';
import { formatPhone } from '@/lib/utils';

export function ContactForm() {
  const contato = useMudendStore((state) => state.contato);
  const updateContato = useMudendStore((state) => state.updateContato);

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Nome completo"
        value={contato.nome}
        onChange={(value) => updateContato({ nome: value })}
        trackingId="contato-nome"
      />
      <Input
        label="Telefone"
        value={contato.telefone}
        onChange={(value) => updateContato({ telefone: formatPhone(value) })}
        trackingId="contato-telefone"
        inputMode="tel"
        placeholder="(11) 90000-0000"
      />
      <Input
        label="E-mail"
        value={contato.email}
        onChange={(value) => updateContato({ email: value })}
        trackingId="contato-email"
        type="email"
        inputMode="email"
      />
    </div>
  );
}
