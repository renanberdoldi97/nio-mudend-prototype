# Nio MUDEND Prototype

Protótipo interativo do fluxo de Mudança de Endereço (MUDEND) do app Nio.
Uso: teste de usabilidade não-moderado com clientes reais, com captura de
dados comportamentais (cliques, tempo por tela, interação com calendário,
abandono de sessão etc.).

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Zustand para state management e captura de eventos

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000 — otimizado para mobile (viewport ≤ 430px).

## Fontes

Plus Jakarta Sans é carregada via `next/font/google` (corpo do texto).
BW Gradual (títulos) é carregada via `@font-face` em `app/globals.css` e cai
em fallback de sistema até os arquivos existirem. Para ativar, copie:

- `BWGradual-Regular.ttf`
- `BWGradual-Medium.ttf`
- `BWGradual-Bold.ttf`

para `/public/fonts/`.

## Tracking

Todo o comportamento do usuário é capturado em `lib/tracking.ts` e
persistido (memória + `localStorage`) via o Zustand store em `lib/store.ts`.
A tela `/mudend/resumo` exibe a sessão completa (formulário + eventos) para
conferência durante o teste — é uma tela de debug, não faz parte da jornada
real do usuário.

Tipos de evento: `screen_view`, `screen_leave`, `element_click`,
`form_input`, `calendar_click`, `checkbox_toggle`, `bottom_sheet_open`,
`bottom_sheet_close`, `session_complete`, `session_abandon`.

## Assets

Ícones e logos do DS Nio copiados do protótipo MVNO:
- `/public/icons/` ← ícones do DS Nio
- `/public/logo/` ← 3 SVGs de logo (Default, White, Highlight)

## Deploy

Vercel — auto-deploy via GitHub main branch.
