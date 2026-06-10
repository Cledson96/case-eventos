# Case Eventos - Frontend

Interface web para gerenciamento de eventos e participantes, consumindo a API do backend.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Axios
- dayjs
- Vitest e Testing Library

Sem bibliotecas de UI (Material UI, Bootstrap). O design system e proprio, em Tailwind.

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

- `/` pagina inicial (orientacao + proximos eventos)
- `/events` listagem de eventos
- `/events/new` cadastro de evento (com previa ao vivo)
- `/events/:eventId` detalhes do evento e inscricao de participantes

## Arquitetura

- **Server Components** buscam dados via a camada de servicos (`src/services`) usando um
  cliente Axios server-side (`src/lib/http.ts`). O token Bearer fica somente no servidor.
- **Route Handlers** (`src/app/api`) atuam como BFF: recebem as submissoes dos formularios
  e repassam ao backend injetando o token.
- **Client Components** cuidam da interatividade (formularios, tema) e do feedback via
  Context API de toasts (`src/components/providers/ToastProvider.tsx`).
- **Regras de dominio** ficam no service (ex.: `eventsService.listUpcoming`); a pagina apenas
  orquestra e decide fallback de UI. Estados de carregamento (`loading.tsx`), erro
  (`error.tsx`) e nao encontrado (`not-found.tsx`) sao tratados pela rota.

## Design system

- **Cor de marca**: ambar/mel como acento decisivo (marca, acoes primarias, links, estado
  ativo) sobre base tinta/papel. A cor vive na marca e na tipografia, nunca no fundo.
- **Identidade sem fotos**: marca grafica propria (`BrandMark`) e o ladrilho de data
  (`DateTile`) carregam a identidade visual.
- **Tema claro/escuro**: alternavel pelo botao no header, padrao claro, persistido em
  `localStorage` e aplicado por classe antes do paint (sem flash). Sem dependencias.
- **Tokens** em `src/app/globals.css`: `--brand*` (marca) e `--border`, expostos como
  utilitarios Tailwind (`bg-brand`, `text-brand-strong`, `border-border`, ...).
- **Tipografia** centralizada no componente `Typography` (variantes de heading, corpo,
  label, caption, erro). Acessibilidade alvo WCAG AA (contraste, foco visivel, labels,
  `prefers-reduced-motion`).

## Componentes e hooks

- `components/layout`: `Header`, `BrandMark`, `BackLink`, `PageContainer`.
- `components/ui`: `Typography`, `TextField`, `DateTile`, `EmptyState`, `Toast`, `styles`.
- `components/providers`: `ToastProvider` (Context API).
- `hooks/useForm`: estado, validacao e submit compartilhados pelos formularios (com
  mascara via `transforms`).

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
    page.tsx
  components/
    layout/
    providers/
    ui/
  config/
  hooks/
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
