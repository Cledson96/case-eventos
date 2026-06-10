# Execucao Local e Docker

## Objetivo deste capitulo

Este capitulo mostra como rodar o projeto completo localmente, com e sem
Docker, e como validar os principais fluxos.

## Pre-requisitos

- Node.js 22 ou superior;
- npm;
- Docker e Docker Compose;
- Git.

## Executar tudo com Docker

Na raiz:

```bash
docker compose up --build
```

URLs:

- frontend: `http://localhost:3000`;
- backend: `http://localhost:3333`;
- Swagger: `http://localhost:3333/docs`;
- health: `http://localhost:3333/health`.

## Executar infraestrutura local

Para subir apenas PostgreSQL e Redis:

```bash
docker compose up -d postgres redis
```

## Rodar backend localmente

```bash
cd backend
cp .env.example .env.dev
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

No PowerShell:

```powershell
cd backend
Copy-Item .env.example .env.dev
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Rodar frontend localmente

Com o backend no ar:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

No PowerShell:

```powershell
cd frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

## Variaveis principais

Backend:

```env
PORT=3333
BASE_URL=http://localhost:3333
API_TOKEN=case-eventos-dev-token
DATABASE_URL=postgresql://case_eventos:case_eventos@localhost:5432/case_eventos?schema=public
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=60
```

Frontend:

```env
API_URL=http://localhost:3333
API_TOKEN=case-eventos-dev-token
```

## Rodar somente backend via Docker

```bash
docker compose up --build backend
```

## Rodar somente frontend via Docker

Com backend fora do compose:

```bash
FRONTEND_API_URL=http://host.docker.internal:3333 docker compose up --build frontend
```

No PowerShell:

```powershell
$env:FRONTEND_API_URL="http://host.docker.internal:3333"
docker compose up --build frontend
```

## Validacao manual

1. Abrir `http://localhost:3000/events`.
2. Abrir `http://localhost:3333/docs`.
3. Criar evento pelo frontend.
4. Criar participante pelo detalhe do evento.
5. Buscar participante.
6. Paginar participantes.
7. Excluir participante.
8. Consultar health do backend.

## Comandos de validacao

Backend:

```bash
cd backend
npm run lint
npm run typecheck
npm test
npm run test:database
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run typecheck
npm test
npm run build
```

## Observacao sobre Redis

Redis e opcional no codigo do backend. Para rodar sem cache, deixe
`REDIS_URL` vazio no env do backend.
