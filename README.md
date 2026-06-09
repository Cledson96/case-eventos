# Case Eventos

Aplicacao para gerenciamento de eventos e participantes.

Status atual: backend implementado em `backend/` e frontend implementado em `frontend/`.

## Stack

- Node.js 22+
- TypeScript
- Express
- Prisma
- PostgreSQL
- Redis opcional para cache
- Vitest
- Supertest
- Swagger/OpenAPI

Frontend:

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Axios
- dayjs
- Vitest e Testing Library

## Estrutura

```txt
backend/
  prisma/
  src/
    infrastructure/
    modules/
      events/
      participants/
    shared/
  tests/
frontend/
  src/
    app/
    components/
    services/
    lib/
docker-compose.yml
```

## Requisitos

- Node.js 22 ou superior
- npm
- Docker e Docker Compose

## Configuracao

Copie o arquivo de exemplo do backend:

```bash
cd backend
cp .env.example .env.dev
```

No Windows PowerShell:

```powershell
cd backend
Copy-Item .env.example .env.dev
```

Variaveis principais:

```env
PORT=3333
API_TOKEN=case-eventos-dev-token
DATABASE_URL=postgresql://case_eventos:case_eventos@localhost:5432/case_eventos?schema=public
DATABASE_TEST_URL=postgresql://case_eventos:case_eventos@localhost:5432/case_eventos?schema=test
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=60
```

O Redis e opcional no codigo. Para rodar sem cache, deixe `REDIS_URL` vazio.

## Como Rodar

Suba PostgreSQL e Redis:

```bash
docker compose up -d
```

Instale as dependencias e gere o Prisma Client:

```bash
cd backend
npm install
npm run db:generate
```

Execute as migrations:

```bash
npm run db:migrate
```

Opcionalmente, gere dados de teste:

```bash
npm run db:seed
```

Inicie a API em desenvolvimento:

```bash
npm run dev
```

A API ficara disponivel em:

- `http://localhost:3333`
- `http://localhost:3333/health`
- `http://localhost:3333/docs`
- `http://localhost:3333/docs.json`

## Frontend

Com o backend em execucao, rode a interface web:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

O frontend ficara disponivel em `http://localhost:3000`. O `API_TOKEN` do
`.env.local` deve ser igual ao do backend. Detalhes em `frontend/README.md`.

## Autenticacao

As rotas de dominio usam Bearer token configurado por `API_TOKEN`.

Envie o header:

```txt
Authorization: Bearer case-eventos-dev-token
```

Health checks e documentacao ficam acessiveis sem token.

## Endpoints

Eventos:

- `POST /events`
- `GET /events`
- `GET /events/:eventId`
- `DELETE /events/:eventId`
- `POST /events/:eventId/participants`
- `GET /events/:eventId/participants`

Participantes:

- `POST /participants`
- `GET /participants`
- `DELETE /participants/:participantId`

Health checks:

- `GET /livez`
- `GET /readyz`
- `GET /health`

## Paginacao

Listagens aceitam:

- `page`: pagina inicial em `1`
- `limit`: padrao `20`, maximo `100`
- `search`: busca textual
- `sort`: campo permitido pelo endpoint
- `order`: `asc` ou `desc`

Formato da resposta paginada:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

## Scripts

No diretorio `backend/`:

```bash
npm run dev
npm run build
npm start
npm run typecheck
npm run lint
npm run format:check
npm run perf:event-participants
npm run perf:event-participants:sweep
npm test
npm run test:database
npm run test:coverage
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:studio
```

## Performance

Para medir carga no endpoint de participantes do evento seedado, suba o banco, execute migrations e seed, inicie a API e rode:

```bash
npm run perf:event-participants
```

Por padrao, o teste usa `GET /events/:eventId/participants?page=1&limit=100` no evento com 1000 participantes. Variaveis opcionais:

```env
PERF_BASE_URL=http://localhost:3333
PERF_CONNECTIONS=10
PERF_DURATION_SECONDS=10
PERF_LIMIT=100
PERF_PIPELINING=1
```

Para medir a capacidade da rota sem bater no rate limit local, suba a API com `RATE_LIMIT_MAX` alto durante o teste.

Para procurar o limite pratico da rota em cargas progressivas, rode:

```bash
npm run perf:event-participants:sweep
```

Por padrao, o sweep testa `2,5,10,25,50` conexoes. Para customizar:

```env
PERF_SWEEP_CONNECTIONS=5,10,25,50,100
PERF_DURATION_SECONDS=30
```

## Validacao

Fluxo recomendado antes de entregar:

```bash
cd backend
npm run format:check
npm run typecheck
npm run lint
npm test
npm run test:database
npm run build
npm audit
```

## Testes com Banco Real

Com o PostgreSQL do Docker em execucao, rode:

```bash
cd backend
npm run test:database
```

O script aplica as migrations no schema `test` usando `DATABASE_TEST_URL` e executa somente os testes em `tests/database`.

## Banco de Dados

As migrations ficam em `backend/prisma/migrations`.

Modelos principais:

- `Event`
- `Participant`
- `EventParticipant`

## Cache

O cache usa Redis quando `REDIS_URL` esta configurada. Caso o Redis esteja indisponivel ou a variavel esteja vazia, a API continua funcionando sem cache.

As chaves de listagem e detalhe possuem TTL configuravel por `CACHE_TTL_SECONDS`.
