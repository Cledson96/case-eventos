# Como Rodar

## Objetivo deste capitulo

Este capitulo mostra como executar o frontend localmente, com Docker e sem
Docker, alem de comandos uteis para validacao rapida.

## Pre-requisitos

Para rodar o frontend, o ambiente esperado inclui:

- Node.js 22 ou superior;
- npm;
- backend do Case Eventos em execucao;
- Docker opcional.

## Instalar dependencias

Dentro da pasta do frontend:

```bash
cd frontend
npm install
```

## Variaveis de ambiente

Crie o arquivo local a partir do exemplo:

```bash
cp .env.example .env.local
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Variaveis principais:

```env
API_URL=http://localhost:3333
API_TOKEN=case-eventos-dev-token
```

`API_TOKEN` deve ser igual ao token configurado no backend.

## Rodando frontend localmente

Com o backend no ar:

```bash
cd frontend
npm run dev
```

URL esperada:

- frontend: `http://localhost:3000`.

## Rodando com Docker Compose local

Na raiz do projeto, para subir tudo:

```bash
docker compose up -d
```

Para subir apenas o frontend via compose:

```bash
docker compose up -d frontend
```

## Rodando build de producao local

```bash
cd frontend
npm run build
npm start
```

O `npm start` executa a aplicacao Next em modo producao.

## Rotas para validar

| Rota               | O que validar                             |
| ------------------ | ----------------------------------------- |
| `/`                | Home e proximos eventos                   |
| `/events`          | Lista de eventos e paginacao              |
| `/events/new`      | Criacao de evento e previa                |
| `/events/:eventId` | Detalhe, busca, participantes e inscricao |

## Scripts uteis

| Script                  | Uso                                   |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Inicia o Next em desenvolvimento      |
| `npm run build`         | Gera build de producao                |
| `npm start`             | Inicia aplicacao buildada             |
| `npm run lint`          | Roda ESLint                           |
| `npm run lint:fix`      | Corrige problemas automaticos de lint |
| `npm run typecheck`     | Valida TypeScript sem emitir arquivos |
| `npm run format`        | Formata arquivos com Prettier         |
| `npm run format:check`  | Verifica formatacao                   |
| `npm test`              | Roda Vitest                           |
| `npm run test:watch`    | Roda Vitest em watch mode             |
| `npm run test:coverage` | Gera cobertura de testes              |

## Validacao rapida

Antes de entregar alteracoes no frontend:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Fluxo manual recomendado

1. Acessar `/events`.
2. Criar evento em `/events/new`.
3. Abrir detalhe do evento criado.
4. Inscrever participante.
5. Buscar participante por e-mail.
6. Trocar pagina de participantes.
7. Excluir participante.
8. Alternar tema claro/escuro.
