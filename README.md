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
`dead_click`, `form_input`, `calendar_click`, `checkbox_toggle`,
`bottom_sheet_open`, `bottom_sheet_close`, `session_complete`,
`session_abandon`.

`dead_click` registra cliques que não atingem nenhum elemento interativo
(nem `data-element-id`, `<button>/<a>/<input>/<select>`, nem `role="button"`)
— útil pra achar onde o participante espera uma ação e nada acontece. O
listener global fica em `app/dead-click-tracker.tsx`.

## Onboarding do participante

Na primeira vez que o protótipo abre, a tela `/onboarding` coleta nome,
celular e endereço atual (autocomplete real). Os dados ficam em
`localStorage` sob a chave `participantSession` e são consumidos pela home,
pela tela de endereço do MUDEND e pelo debug. Enquanto não houver sessão,
qualquer rota redireciona pro onboarding. Para reiniciar, use "Nova sessão"
na tela `/mudend/resumo`.

## Autocomplete de endereço

`/api/address-search` é um proxy híbrido:

- Query no formato de CEP (`00000-000`) → ViaCEP, devolvendo um único
  resultado sem número (o participante completa o número no fluxo).
- Qualquer outro texto → Nominatim (OpenStreetMap), com `User-Agent`
  próprio exigido pelo serviço.

## Configuração do webhook de sessão

Ao final da jornada, `/sessao-concluida` envia os dados da sessão
(participante + formulário + eventos) automaticamente para
`/api/submit-session`, que repassa para o webhook configurado. Se o envio
falhar, o participante recebe a opção de baixar o JSON localmente.

Configurar env var `SESSION_WEBHOOK_URL` na Vercel. Três opções:

1. Discord (recomendado): criar servidor privado > Settings > Integrations >
   Webhooks > New Webhook > copiar URL
2. Slack: criar app com Incoming Webhook e copiar URL
3. webhook.site (só pra testes rápidos): abrir webhook.site, copiar URL
   única gerada

Por padrão o payload vai como *rich embed* do Discord. Para enviar o JSON
puro (necessário no Slack e no webhook.site), defina também
`SESSION_WEBHOOK_FORMAT=raw`.

## Assets

Ícones e logos do DS Nio copiados do protótipo MVNO:
- `/public/icons/` ← ícones do DS Nio
- `/public/logo/` ← 3 SVGs de logo (Default, White, Highlight)

## Deploy

Vercel — auto-deploy via GitHub main branch.
