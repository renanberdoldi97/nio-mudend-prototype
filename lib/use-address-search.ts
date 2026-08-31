'use client';

import { useEffect, useState } from 'react';
import type { EnderecoSugestao } from './types';

type AddressSearch = {
  results: EnderecoSugestao[];
  isLoading: boolean;
  error: string | null;
};

const MIN_LENGTH = 4;
const DEBOUNCE_MS = 400;

/**
 * Autocomplete de endereço via /api/address-search (proxy do Nominatim).
 * Debounce de 400ms e só dispara com query de 4+ caracteres.
 */
export function useAddressSearch(query: string): AddressSearch {
  const [results, setResults] = useState<EnderecoSugestao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();

    if (q.length < MIN_LENGTH) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      fetch(`/api/address-search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error('request_failed');
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;
          setResults(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return;
          setResults([]);
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

  return { results, isLoading, error };
}
