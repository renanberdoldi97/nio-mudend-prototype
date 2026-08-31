'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { useMudendStore } from '@/lib/store';
import { useParticipantSession } from '@/lib/participant-session';
import { FlowHeader } from '@/components/ui/FlowHeader';
import { FlowScreen } from '@/components/ui/FlowScreen';
import { ExitConfirmSheet } from '@/components/ui/ExitConfirmSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { HouseIllustration } from '@/components/mudend/HouseIllustration';
import { AddressAutocomplete } from '@/components/mudend/AddressAutocomplete';
import { ENDERECO_ATUAL } from '@/lib/mock-data';
import { formatSugestaoLinha, formatEnderecoAtual } from '@/lib/address';
import type { EnderecoSugestao } from '@/lib/types';

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

  const { session } = useParticipantSession();

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

  const enderecoAtual = session?.currentAddress
    ? formatEnderecoAtual(session.currentAddress)
    : ENDERECO_ATUAL;

  const isSelected = Boolean(enderecoSugestao);

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
      temNumero: Boolean(sugestao.address?.house_number),
    });
  }

  const sugestaoTemNumero = Boolean(enderecoSugestao?.address?.house_number);
  const showNumero = isSelected && !sugestaoTemNumero;
  const showComplemento = isSelected;

  const temNumero = sugestaoTemNumero || numero.trim().length > 0;
  const complementoOk = complementoSkipped || complemento.trim().length > 0;
  const isValid = isSelected && temNumero && complementoOk;

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
          <p className="text-xs text-text-secondary">{enderecoAtual.eyebrow}</p>
          <p className="mt-2 text-sm font-semibold text-text-primary">{enderecoAtual.linha}</p>
        </Card>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-text-primary">
          Pra onde você quer levar sua Nio Fibra?
        </p>

        <div className="mt-4">
          <AddressAutocomplete
            label="Seu novo endereço ou CEP"
            placeholder="Digite a rua ou o CEP"
            value={novoEndereco}
            onValueChange={handleEnderecoChange}
            selected={enderecoSugestao}
            onSelect={handleSelectSugestao}
            trackingId="endereco-novo"
          />
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
