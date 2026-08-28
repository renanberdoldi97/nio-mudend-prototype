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
import { HouseIllustration } from '@/components/mudend/HouseIllustration';
import { ENDERECO_ATUAL } from '@/lib/mock-data';
import { isCepLike, fetchViaCep, hasNumero } from '@/lib/viacep';

type ValidationSource = 'cep' | 'text' | null;

export default function EnderecoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();

  const novoEndereco = useMudendStore((state) => state.novoEndereco);
  const updateNovoEndereco = useMudendStore((state) => state.updateNovoEndereco);
  const enderecoCepInfo = useMudendStore((state) => state.enderecoCepInfo);
  const setEnderecoCepInfo = useMudendStore((state) => state.setEnderecoCepInfo);
  const numero = useMudendStore((state) => state.numero);
  const updateNumero = useMudendStore((state) => state.updateNumero);
  const complemento = useMudendStore((state) => state.complemento);
  const updateComplemento = useMudendStore((state) => state.updateComplemento);
  const complementoSkipped = useMudendStore((state) => state.complementoSkipped);
  const setComplementoSkipped = useMudendStore((state) => state.setComplementoSkipped);

  const [exitOpen, setExitOpen] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [validationSource, setValidationSource] = useState<ValidationSource>(
    novoEndereco.trim().length >= 3 ? 'text' : null
  );

  async function handleEnderecoChange(value: string) {
    updateNovoEndereco(value);
    setCepError(null);
    setValidationSource(null);

    if (isCepLike(value)) {
      setCepLoading(true);
      const result = await fetchViaCep(value);
      setCepLoading(false);

      // Se o cliente continuou digitando enquanto a busca estava em andamento,
      // não sobrescreve o que ele já digitou.
      const aindaEhOMesmoValor = useMudendStore.getState().novoEndereco === value;
      if (!aindaEhOMesmoValor) return;

      if (result) {
        updateNovoEndereco(result.logradouro);
        setEnderecoCepInfo(`CEP ${result.cep} · ${result.localidade}/${result.uf}`);
        setValidationSource('cep');
        trackEvent('form_input', pathname, 'endereco-cep-autofill', { cep: value, encontrado: true });
      } else {
        setEnderecoCepInfo(null);
        setCepError('CEP não encontrado. Confira o número ou digite o nome da rua.');
        trackEvent('form_input', pathname, 'endereco-cep-autofill', { cep: value, encontrado: false });
      }
      return;
    }

    setEnderecoCepInfo(null);
    if (value.trim().length >= 3) {
      setValidationSource('text');
    }
  }

  const needsNumero = validationSource === 'cep' ? true : !hasNumero(novoEndereco);
  const showNumero = validationSource !== null && needsNumero;
  const showComplemento =
    validationSource !== null && (!needsNumero || numero.trim().length > 0);

  const isValid =
    validationSource !== null &&
    (!needsNumero || numero.trim().length > 0) &&
    (complementoSkipped || complemento.trim().length > 0);

  function handleSemComplemento() {
    trackEvent('complement_skipped', pathname, 'complemento-sem-complemento');
    setComplementoSkipped(true);
  }

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
      overlay={<ExitConfirmSheet open={exitOpen} onClose={() => setExitOpen(false)} />}
    >
      <h1 className="mb-2 text-2xl font-semibold text-text-primary">
        Vamos levar sua Nio Fibra pro novo endereço
      </h1>
      <p className="mb-6 text-sm text-text-secondary">
        Você só precisa nos contar pra onde está se mudando.
      </p>

      <p className="mb-2 text-sm font-medium text-text-primary">Seu endereço atual</p>
      <Card variant="neutral" padding="md" className="mb-6">
        <p className="text-xs text-text-secondary">{ENDERECO_ATUAL.eyebrow}</p>
        <p className="mt-1 text-sm font-semibold text-text-primary">{ENDERECO_ATUAL.linha}</p>
      </Card>

      <p className="mb-2 text-sm font-medium text-text-primary">Pra onde você quer levar sua Nio Fibra?</p>
      <Input
        label="Seu novo endereço ou CEP"
        value={novoEndereco}
        onChange={handleEnderecoChange}
        trackingId="endereco-novo"
        valid={validationSource !== null && !cepLoading}
        loading={cepLoading}
        error={cepError ?? undefined}
        hint={enderecoCepInfo ?? undefined}
      />

      {showNumero && (
        <div className="mt-3">
          <Input
            label="Número"
            value={numero}
            onChange={updateNumero}
            trackingId="endereco-numero"
            inputMode="numeric"
            valid={numero.trim().length > 0}
          />
        </div>
      )}

      {showComplemento && (
        <div className="mt-3">
          {complementoSkipped ? (
            <div className="flex h-14 w-full items-center justify-between rounded-md border-[1.5px] border-primary-background bg-white px-4">
              <span className="text-base text-text-primary">Sem complemento</span>
              <button
                type="button"
                onClick={() => {
                  trackEvent('element_click', pathname, 'complemento-remover-skip');
                  setComplementoSkipped(false);
                }}
                aria-label="Remover marcação de sem complemento"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                  <path
                    d="M5 5L15 15M15 5L5 15"
                    stroke="#124803"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <Input
                label="Complemento"
                value={complemento}
                onChange={updateComplemento}
                trackingId="endereco-complemento"
                placeholder="Ex: Apartamento 12, Casa 2, Bloco A..."
                valid={complemento.trim().length > 0}
              />
              <button
                type="button"
                onClick={handleSemComplemento}
                className="mt-2 px-1 text-sm font-medium text-primary-background"
              >
                Sem complemento
              </button>
            </>
          )}
        </div>
      )}
    </FlowScreen>
  );
}
