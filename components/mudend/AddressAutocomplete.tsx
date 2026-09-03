'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { trackEvent } from '@/lib/tracking';
import { useAddressSearch } from '@/lib/use-address-search';
import { formatSugestaoLinha, formatSugestaoDetalhe } from '@/lib/address';
import { isCepLike } from '@/lib/viacep';
import {
  buscarCepsLocais,
  acharCepExato,
  formatCepLocalLinha,
  cepLocalParaSugestao,
} from '@/lib/ceps-sp';
import type { EnderecoSugestao } from '@/lib/types';

type AddressAutocompleteProps = {
  label: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  selected: EnderecoSugestao | null;
  onSelect: (sugestao: EnderecoSugestao) => void;
  trackingId: string;
};

/** Texto que só tem dígitos, espaços ou hífens — ou seja, o cliente está digitando um CEP. */
function pareceCep(value: string): boolean {
  const t = value.trim();
  return t.length > 0 && /^[\d\s-]+$/.test(t);
}

/**
 * Campo de endereço com autocomplete híbrido:
 * - CEP parcial (4-7 dígitos): dropdown local a partir de `lib/ceps-sp.ts`,
 *   ordenado por CEP crescente, sem bater na rede.
 * - CEP completo (8 dígitos) na base local: autocompleta na hora.
 * - CEP completo fora da base: cai no ViaCEP (via /api/address-search).
 * - Texto livre: autocomplete de endereço via Nominatim.
 * Mesma lógica usada na tela de endereço do MUDEND e no onboarding do participante.
 */
export function AddressAutocomplete({
  label,
  placeholder,
  value,
  onValueChange,
  selected,
  onSelect,
  trackingId,
}: AddressAutocompleteProps) {
  const pathname = usePathname();

  // Dropdown fechado por clique fora — sem selecionar nada. Volta a abrir assim
  // que o cliente digita de novo. Fechar assim NUNCA marca o campo como "selected".
  const containerRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => setDismissed(false), [value]);
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setDismissed(true);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const digits = value.replace(/\D/g, '');
  const cepParcial = !selected && pareceCep(value) && digits.length >= 4 && digits.length < 8;
  const cepExato = !selected && digits.length === 8 ? acharCepExato(digits) : null;

  const cepLocais = cepParcial ? buscarCepsLocais(digits) : [];

  // Suprime a busca remota enquanto o cliente digita um CEP que resolvemos localmente.
  const remoteQuery = selected || cepParcial || cepExato ? '' : value;
  const { results, isLoading, error, numeroSemResultado } = useAddressSearch(remoteQuery);

  const open = !selected && !dismissed && (cepParcial || value.trim().length >= 4);
  const queryEraCep = isCepLike(value);

  const emptyMessage = numeroSemResultado
    ? 'Não encontramos esse número. Tente digitar só o nome da rua e escolher da lista.'
    : queryEraCep
      ? 'CEP não encontrado. Verifique a digitação.'
      : 'Nenhum endereço encontrado. Tente incluir o bairro ou cidade.';

  function handleSelectSugestao(sugestao: EnderecoSugestao) {
    onSelect(sugestao);
  }

  // Ao sair do campo com uma sugestão selecionada, normaliza o texto pro formato
  // canônico ("rua" quando não há número, "rua, número" quando há). Se o cliente
  // tiver mexido no logradouro, a seleção já foi limpa antes daqui.
  function handleBlur() {
    if (!selected) return;
    const canonical = formatSugestaoLinha(selected);
    if (value !== canonical) onValueChange(canonical);
  }

  function handleSelectCepLocal(cep: string) {
    const item = acharCepExato(cep) ?? buscarCepsLocais(cep, 1)[0];
    if (!item) return;
    trackEvent('cep_suggestion_selected', pathname, trackingId, { cep: item.cep });
    onSelect(cepLocalParaSugestao(item));
  }

  // Completou os 8 dígitos e o CEP está na base local → autocompleta na hora.
  useEffect(() => {
    if (!cepExato) return;
    trackEvent('cep_suggestion_selected', pathname, trackingId, {
      cep: cepExato.cep,
      origem: 'digitacao',
    });
    onSelect(cepLocalParaSugestao(cepExato));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepExato?.cep]);

  // Dispara `cep_suggestion_shown` uma vez por CEP exibido.
  const shownRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!cepParcial) return;
    for (const item of cepLocais) {
      if (shownRef.current.has(item.cep)) continue;
      shownRef.current.add(item.cep);
      trackEvent('cep_suggestion_shown', pathname, trackingId, { cep: item.cep });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepParcial, cepLocais.map((c) => c.cep).join(',')]);

  return (
    <div className="relative" ref={containerRef}>
      <Input
        label={label}
        value={value}
        onChange={onValueChange}
        trackingId={trackingId}
        valid={Boolean(selected)}
        placeholder={placeholder}
        onBlurExtra={handleBlur}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-md border border-border bg-white shadow-elevated"
          >
            {cepParcial ? (
              cepLocais.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {cepLocais.map((item) => (
                    <li key={item.cep}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectCepLocal(item.cep)}
                        title={formatCepLocalLinha(item)}
                        className="block w-full truncate border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-b-0 hover:bg-areia active:bg-areia"
                      >
                        <span className="font-semibold text-text-primary">{item.cep}</span>
                        <span className="text-text-secondary">
                          {' '}
                          &ndash; {item.logradouro}, {item.bairro}, {item.cidade}/{item.uf}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-sm text-text-secondary">
                  Nenhum CEP encontrado na base local. Complete os 8 dígitos que buscamos pra você.
                </p>
              )
            ) : isLoading ? (
              <p className="px-4 py-3 text-sm text-text-secondary">Buscando endereços...</p>
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
                      className="w-full border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-areia active:bg-areia"
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
              <p className="px-4 py-3 text-sm text-text-secondary">{emptyMessage}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
