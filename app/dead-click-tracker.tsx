'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

/** Tags que já são interativas por natureza — clique nelas não é "dead". */
const INTERACTIVE_TAGS = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']);

const DEBOUNCE_MS = 200;

/**
 * Sobe do alvo do clique até o body procurando um elemento "com rastreamento":
 * tem `data-element-id`, é uma tag interativa, ou tem `role="button"`.
 */
function atingiuElementoRastreado(start: Element | null): boolean {
  let el: Element | null = start;
  while (el && el !== document.body) {
    if (el.hasAttribute('data-element-id')) return true;
    if (INTERACTIVE_TAGS.has(el.tagName)) return true;
    if (el.getAttribute('role') === 'button') return true;
    el = el.parentElement;
  }
  return false;
}

/** Houve seleção de texto neste gesto? Então não foi um clique puro. */
function houveSelecaoDeTexto(): boolean {
  const sel = typeof window.getSelection === 'function' ? window.getSelection() : null;
  return Boolean(sel && sel.type === 'Range' && sel.toString().length > 0);
}

/**
 * Rastreia "dead clicks": cliques que não atingem nenhum elemento interativo /
 * com `element_id`. Útil pra descobrir onde o participante *acha* que dá pra
 * clicar mas não acontece nada. Montado uma vez no layout raiz.
 */
export function DeadClickTracker() {
  useEffect(() => {
    let ultimoRegistro = 0;

    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;

      // Clique em área totalmente vazia (caiu direto no body) → ignora.
      if (!target || target === document.body) return;

      // Só clique puro — sem seleção de texto (drag/scroll não disparam `click`).
      if (houveSelecaoDeTexto()) return;

      // Atingiu algo já rastreado → o rastreamento existente cuida.
      if (atingiuElementoRastreado(target)) return;

      // Debounce: evita duplo-registro em cliques muito rápidos.
      const agora = Date.now();
      if (agora - ultimoRegistro < DEBOUNCE_MS) return;
      ultimoRegistro = agora;

      const texto = (target.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);

      trackEvent('dead_click', window.location.pathname, undefined, {
        tag: target.tagName.toLowerCase(),
        coords: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
        text: texto,
      });
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
