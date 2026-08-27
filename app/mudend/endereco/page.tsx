'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { useMudendStore } from '@/lib/store';
import { FlowHeader } from '@/components/ui/FlowHeader';
import { FlowScreen } from '@/components/ui/FlowScreen';
import { ExitConfirmSheet } from '@/components/ui/ExitConfirmSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ComplementoSheet } from '@/components/mudend/ComplementoSheet';
import { HouseIllustration } from '@/components/mudend/HouseIllustration';
import { ENDERECO_ATUAL } from '@/lib/mock-data';
import { isCepLike, fetchViaCep } from '@/lib/viacep';

export default function EnderecoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();

  const novoEndereco = useMudendStore((state) => state.novoEndereco);
  const updateNovoEndereco = useMudendStore((state) => state.updateNovoEndereco);
  const complemento = useMudendStore((state) => state.complemento);
  const updateComplemento = useMudendStore((state) => state.updateComplemento);

  const [exitOpen, setExitOpen] = useState(false);
  const [complementoSheetOpen, setComplementoSheetOpen] = useState(false);
  const [complementoCustom, setComplementoCustom] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  async function handleEnderecoChange(value: string) {
    updateNovoEndereco(value);
    if (isCepLike(value)) {
      setCepLoading(true);
      const result = await fetchViaCep(value);
      setCepLoading(false);

      // Se o cliente continuou digitando enquanto a busca estava em andamento,
      // não sobrescreve o que ele já digitou.
      const aindaEhOMesmoValor = useMudendStore.getState().novoEndereco === value;
      if (!aindaEhOMesmoValor) return;

      if (result) {
        updateNovoEndereco(`${result.logradouro}, `);
        trackEvent('form_input', pathname, 'endereco-cep-autofill', { cep: value, encontrado: true });
      } else {
        trackEvent('form_input', pathname, 'endereco-cep-autofill', { cep: value, encontrado: false });
      }
    }
  }

  function openComplementoPicker() {
    trackEvent('element_click', pathname, 'complemento-abrir');
    setComplementoSheetOpen(true);
  }

  const isValid = novoEndereco.trim().length > 0;

  return (
    <FlowScreen
      header={
        <FlowHeader
          title="Mudança de endereço"
          variant="hero"
          illustration={<HouseIllustration />}
          onExitRequest={() => setExitOpen(true)}
        />
      }
      cta={
        <Button trackingId="endereco-continuar" disabled={!isValid} onClick={() => router.push('/mudend/consulta')}>
          Continuar
        </Button>
      }
      overlay={
        <>
          <ExitConfirmSheet open={exitOpen} onClose={() => setExitOpen(false)} />
          <ComplementoSheet
            open={complementoSheetOpen}
            onClose={() => setComplementoSheetOpen(false)}
            onSelect={(value) => {
              updateComplemento(value);
              setComplementoCustom(false);
              setComplementoSheetOpen(false);
            }}
            onCustom={() => {
              setComplementoCustom(true);
              setComplementoSheetOpen(false);
            }}
          />
        </>
      }
    >
      <h1 className="mb-2 text-2xl font-semibold text-verde-escuro">
        Vamos levar sua Nio Fibra pro novo endereço
      </h1>
      <p className="mb-6 text-sm text-text-secondary">
        Você só precisa nos contar pra onde está se mudando.
      </p>

      <p className="mb-2 text-sm font-medium text-verde-escuro">Seu endereço atual</p>
      <Card variant="neutral" padding="md" className="mb-6">
        <p className="text-xs text-text-secondary">{ENDERECO_ATUAL.eyebrow}</p>
        <p className="mt-1 text-sm font-semibold text-verde-escuro">{ENDERECO_ATUAL.linha}</p>
      </Card>

      <p className="mb-2 text-sm font-medium text-verde-escuro">Pra onde você quer levar sua Nio Fibra?</p>
      <Input
        label="Seu novo endereço ou CEP"
        value={novoEndereco}
        onChange={handleEnderecoChange}
        trackingId="endereco-novo"
        valid={isValid && !cepLoading}
        loading={cepLoading}
      />

      {isValid && (
        <div className="mt-3">
          {complementoCustom ? (
            <Input
              label="Complemento"
              value={complemento}
              onChange={updateComplemento}
              trackingId="endereco-complemento-custom"
              valid={complemento.trim().length > 0}
            />
          ) : complemento ? (
            <button
              type="button"
              onClick={openComplementoPicker}
              className="flex h-14 w-full items-center justify-between rounded-lg border-[1.5px] border-verde-neon bg-white px-4 text-left"
            >
              <span className="text-base text-verde-escuro">{complemento}</span>
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                <circle cx="10" cy="10" r="9" fill="#32E000" />
                <path d="M6 10.5L8.5 13L14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={openComplementoPicker}
              className="flex h-14 w-full items-center justify-between rounded-lg border-[1.5px] border-border bg-white px-4 text-left"
            >
              <span className="text-base text-text-secondary">Complemento</span>
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#5C6B5E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      )}
    </FlowScreen>
  );
}
