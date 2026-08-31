'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { useMudendStore } from '@/lib/store';
import { FlowHeader } from '@/components/ui/FlowHeader';
import { FlowScreen } from '@/components/ui/FlowScreen';
import { ExitConfirmSheet } from '@/components/ui/ExitConfirmSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { HouseIllustration } from '@/components/mudend/HouseIllustration';
import { ENDERECO_ATUAL } from '@/lib/mock-data';
import { formatSugestaoLinha, formatSugestaoDetalhe } from '@/lib/address';
import { useAddressSearch } from '@/lib/use-address-search';
import type { EnderecoSugestao, EnderecoState } from '@/lib/types';

const conditionalMotion = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

export default function EnderecoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();

  const novoEndereco = useMudendStore((s) => s.novoEndereco);
  const updateNovoEndereco = useMudendStore((s) => s.updateNovoEndereco);
  const enderecoSugestao = useMudendStore((s) => s.enderecoSugestao);
  const setEnderecoSugestao = useMudendStore((s) => s.setEnderecoSugestao);
  const numero = useMudendStore((s) => s.numero);
  const updateNumero = useMudendStore((s) => s.updateNumero);
  const complemento = useMudendStore((s) => s.complemento);
  const updateComplemento = useMudendStore((s) => s.updateComplemento);
  const complementoSkipped = useMudendStore((s) => s.complementoSkipped);
  const setComplementoSkipped = useMudendStore((s) => s.setComplementoSkipped);

  const [exitOpen, setExitOpen] = useState(false);

  const state: EnderecoState = enderecoSugestao
    ? 'selected'
    : novoEndereco.trim().length >= 4
      ? 'typing'
      : 'idle';

  const { results, isLoading, error } = useAddressSearch(
    enderecoSugestao ? '' : novoEndereco
  );

  function limparCondicionais() {
    updateNumero('');
    updateComplemento('');
    setComplementoSkipped(false);
  }

  function handleEnderecoChange(value: string) {
    updateNovoEndereco(value);
    // Editar o campo depois de selecionar volta pro estado de digitação:
    // o check verde some e os campos condicionais desaparecem.
    if (enderecoSugestao && value !== formatSugestaoLinha(enderecoSugestao)) {
      setEnderecoSugestao(null);
      limparCondicionais();
    }
  }

  function handleSelectSugestao(sugestao: EnderecoSugestao) {
    setEnderecoSugestao(sugestao);
    updateNovoEndereco(formatSugestaoLinha(sugestao));
    limparCondicionais();
    trackEvent('form_input', pathname, 'endereco-sugestao-selecionada', {
      id: sugestao.place_id,
      temNumero: Boolean(sugestao.address.house_number),
    });
  }

  const sugestaoTemNumero = Boolean(enderecoSugestao?.address?.house_number);
  const showNumero = state === 'selected' && !sugestaoTemNumero;
  const showComplemento = state === 'selected';

  const temNumero = sugestaoTemNumero || numero.trim().length > 0;
  const complementoOk = complementoSkipped || complemento.trim().length > 0;
  const isValid = state === 'selected' && temNumero && complementoOk;

  function handleToggleSemComplemento(checked: boolean) {
    if (checked) updateComplemento('');
    setComplementoSkipped(checked);
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
        <Button
          trackingId="endereco-continuar"
          disabled={!isValid}
          onClick={() => router.push('/mudend/consulta')}
        >
          Continuar
        </Button>
      }
      overlay={<ExitConfirmSheet open={exitOpen} onClose={() => setExitOpen(false)} />}
    >
      <h1 className="text-2xl font-semibold text-text-primary">
        Vamos levar sua Nio Fibra pro novo endereço
      </h1>
      <p className="mt-4 text-sm text-text-secondary">
        Você só precisa nos contar pra onde está se mudando.
      </p>

      <div className="mt-6">
        <p className="text-sm font-medium text-text-primary">Seu endereço atual</p>
        <Card variant="neutral" padding="md" className="mt-4 rounded-lg">
          <p className="text-xs text-text-secondary">{ENDERECO_ATUAL.eyebrow}</p>
          <p className="mt-2 text-sm font-semibold text-text-primary">{ENDERECO_ATUAL.linha}</p>
        </Card>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-text-primary">
          Pra onde você quer levar sua Nio Fibra?
        </p>

        <div className="relative mt-4">
          <Input
            label="Seu novo endereço ou CEP"
            value={novoEndereco}
            onChange={handleEnderecoChange}
            trackingId="endereco-novo"
            valid={state === 'selected'}
            placeholder="Digite a rua ou o CEP"
          />

          <AnimatePresence>
            {state === 'typing' && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-md border border-border bg-white shadow-elevated"
              >
                {isLoading ? (
                  <p className="px-4 py-3 text-sm text-text-secondary">
                    Buscando endereços...
                  </p>
                ) : error ? (
                  <p className="px-4 py-3 text-sm text-text-secondary">{error}</p>
                ) : results.length > 0 ? (
                  <ul>
                    {results.map((sugestao) => (
                      <li key={sugestao.place_id}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectSugestao(sugestao)}
                          className="w-full border-b border-border px-4 py-3 text-left last:border-b-0 active:bg-areia"
                        >
                          <span className="block text-sm font-semibold text-text-primary">
                            {formatSugestaoLinha(sugestao)}
                          </span>
                          <span className="mt-1 block text-xs font-normal text-text-secondary">
                            {formatSugestaoDetalhe(sugestao)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-sm text-text-secondary">
                    Nenhum endereço encontrado. Confira a digitação.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false}>
          {showNumero && (
            <motion.div key="numero" {...conditionalMotion} className="mt-6">
              <Input
                label="Número"
                value={numero}
                onChange={updateNumero}
                trackingId="endereco-numero"
                inputMode="numeric"
                valid={numero.trim().length > 0}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {showComplemento && (
            <motion.div key="complemento" {...conditionalMotion} className="mt-6">
              <Input
                label="Complemento"
                value={complemento}
                onChange={updateComplemento}
                trackingId="endereco-complemento"
                placeholder="Ex: Apartamento 12, Casa 2, Bloco A..."
                disabled={complementoSkipped}
                valid={!complementoSkipped && complemento.trim().length > 0}
              />
              <Checkbox
                className="mt-4"
                checked={complementoSkipped}
                onChange={handleToggleSemComplemento}
                trackingId="complemento-sem-complemento"
                label="Sem complemento"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FlowScreen>
  );
}
