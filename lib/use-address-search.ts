'use client';

import { useEffect, useState } from 'react';
import { numeroNaQuery } from './address';
import type { EnderecoSugestao } from './types';

type AddressSearch = {
  results: EnderecoSugestao[];
  isLoading: boolean;
  error: string | null;
  /**
   * A query terminava num número específico ("Rua X, 2299") mas nenhum resultado
   * do Nominatim bateu com esse número — o campo deve mostrar um empty state
   * dedicado em vez da mensagem genérica.
   */
  numeroSemResultado: boolean;
};

const MIN_LENGTH = 4;
const DEBOUNCE_MS = 400;

/**
 * Autocomplete de endereço via /api/address-search (proxy do Nominatim).
 * Debounce de 400ms e só dispara com query de 4+ caracteres.
 *
 * Quando a query termina num número de porta ("Rua X, 2299"), a busca vai
 * completa pro Nominatim mas os resultados são filtrados no cliente: só ficam
 * sugestões cujo `address.house_number` é exatamente o número digitado.
 */
export function useAddressSearch(query: string): AddressSearch {
  const [results, setResults] = useState<EnderecoSugestao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numeroSemResultado, setNumeroSemResultado] = useState(false);

  useEffect(() => {
    const q = query.trim();

    if (q.length < MIN_LENGTH) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      setNumeroSemResultado(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    setNumeroSemResultado(false);

    const timer = setTimeout(() => {
      fetch(`/api/address-search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error('request_failed');
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;
          const list: EnderecoSugestao[] = Array.isArray(data) ? data : [];
          const numero = numeroNaQuery(q);

          if (numero) {
            const comNumero = list.filter(
              (s) => String(s.address?.house_number ?? '') === numero
            );
            setResults(comNumero);
            setNumeroSemResultado(comNumero.length === 0);
          } else {
            setResults(list);
            setNumeroSemResultado(false);
          }
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return;
          setResults([]);
          setNumeroSemResultado(false);
          setError('Não foi possível buscar endereços agora. Tente de novo.');
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  return { results, isLoading, error, numeroSemResultado };
}
