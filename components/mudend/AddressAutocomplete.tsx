'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { useAddressSearch } from '@/lib/use-address-search';
import { formatSugestaoLinha, formatSugestaoDetalhe } from '@/lib/address';
import { isCepLike } from '@/lib/viacep';
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

/**
 * Campo de endereço com autocomplete híbrido (ViaCEP + Nominatim via
 * /api/address-search). Mesma lógica usada na tela de endereço do MUDEND e no
 * onboarding do participante.
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
  const { results, isLoading, error } = useAddressSearch(selected ? '' : value);
  const open = !selected && value.trim().length >= 4;
  const queryEraCep = isCepLike(value);

  const emptyMessage = queryEraCep
    ? 'CEP não encontrado. Verifique a digitação.'
    : 'Nenhum endereço encontrado. Tente incluir o bairro ou cidade.';

  return (
    <div className="relative">
      <Input
        label={label}
        value={value}
        onChange={onValueChange}
        trackingId={trackingId}
        valid={Boolean(selected)}
        placeholder={placeholder}
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
            {isLoading ? (
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
                      onClick={() => onSelect(sugestao)}
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
              <p className="px-4 py-3 text-sm text-text-secondary">{emptyMessage}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
