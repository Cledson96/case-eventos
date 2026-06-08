# Case Eventos - Frontend

Interface web para gerenciamento de eventos e participantes, consumindo a API do backend.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Axios
- dayjs
- Vitest e Testing Library

## Requisitos

- Node.js 20 ou superior
- npm
- Backend do Case Eventos em execucao (ver `../backend`)

## Configuracao

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Variaveis (uso server-side, nunca expostas ao browser):

```env
API_URL=http://localhost:3333
API_TOKEN=case-eventos-dev-token
```

O `API_TOKEN` deve ser igual ao configurado no backend.

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Suba o backend (em `../backend`) e inicie o frontend:

```bash
npm run dev
```

A aplicacao ficara disponivel em `http://localhost:3000`.

- `/` pagina inicial
- `/events` listagem de eventos
- `/events/new` cadastro de evento
- `/events/:eventId` detalhes do evento e inscricao de participantes

## Arquitetura

- **Server Components** buscam dados via a camada de servicos (`src/services`) usando um
  cliente Axios server-side (`src/lib/http.ts`). O token Bearer fica somente no servidor.
- **Route Handlers** (`src/app/api`) atuam como BFF: recebem as submissoes dos formularios
  e repassam ao backend injetando o token.
- **Client Components** cuidam da interatividade (formularios) e do feedback via Context API
  de toasts (`src/components/providers/ToastProvider.tsx`).

## Estrutura

```txt
src/
  app/
    events/
      [eventId]/
      new/
    api/
    layout.tsx
    not-found.tsx
  components/
    layout/
    providers/
    ui/
  config/
  lib/
  services/
  types/
  utils/
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npm run typecheck
npm run format
npm run format:check
npm test
npm run test:coverage
```

## Validacao

Fluxo recomendado antes de entregar:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```
