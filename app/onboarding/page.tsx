'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AddressAutocomplete } from '@/components/mudend/AddressAutocomplete';
import { formatSugestaoLinha } from '@/lib/address';
import { formatPhone } from '@/lib/utils';
import {
  writeParticipantSession,
  createParticipantSessionId,
} from '@/lib/participant-session';
import type { EnderecoSugestao } from '@/lib/types';

export default function OnboardingPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [sugestao, setSugestao] = useState<EnderecoSugestao | null>(null);

  const phoneDigits = phone.replace(/\D/g, '');
  const isValid =
    name.trim().length >= 2 && phoneDigits.length >= 10 && sugestao !== null;

  function handleEnderecoChange(value: string) {
    setEndereco(value);
    if (sugestao && value !== formatSugestaoLinha(sugestao)) {
      setSugestao(null);
    }
  }

  function handleSelect(next: EnderecoSugestao) {
    setSugestao(next);
    setEndereco(formatSugestaoLinha(next));
    trackEvent('form_input', pathname, 'onboarding-endereco-selecionado', {
      id: next.place_id,
    });
  }

  function handleStart() {
    if (!isValid || !sugestao) return;
    writeParticipantSession({
      name: name.trim(),
      phone,
      currentAddress: sugestao,
      sessionId: createParticipantSessionId(),
      startedAt: Date.now(),
    });
    trackEvent('element_click', pathname, 'onboarding-comecar');
    router.replace('/');
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="shrink-0 bg-verde-escuro px-5 pb-6 pt-10">
        <Image
          src="/logo/Color=White.svg"
          alt="Nio"
          width={52}
          height={28}
          unoptimized
          priority
        />
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-40 pt-6">
        <h1 className="text-2xl font-bold text-text-primary">Antes de começar</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Precisamos de algumas informações pra personalizar sua experiência de teste.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          <Input
            label="Seu nome"
            value={name}
            onChange={setName}
            trackingId="onboarding-nome"
            valid={name.trim().length >= 2}
          />
          <Input
            label="Seu celular"
            value={phone}
            onChange={(v) => setPhone(formatPhone(v))}
            trackingId="onboarding-celular"
            inputMode="tel"
            placeholder="(11) 91234-5678"
            valid={phoneDigits.length >= 10}
          />
          <AddressAutocomplete
            label="Seu endereço atual"
            placeholder="Digite a rua ou o CEP"
            value={endereco}
            onValueChange={handleEnderecoChange}
            selected={sugestao}
            onSelect={handleSelect}
            trackingId="onboarding-endereco"
          />
        </div>
      </main>

      <div className="absolute inset-x-0 bottom-0 border-t border-border bg-white/95 px-4 pb-6 pt-3 backdrop-blur">
        <Button trackingId="onboarding-comecar-btn" disabled={!isValid} onClick={handleStart}>
          Começar
        </Button>
      </div>
    </div>
  );
}
