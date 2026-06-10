# Como Rodar

## Objetivo deste capitulo

Este capitulo mostra como executar o backend localmente, com Docker e sem
Docker, alem de comandos uteis para migrations, seed e validacao rapida.

## Pre-requisitos

Para rodar o backend, o ambiente esperado inclui:

- Node.js 22 ou superior;
- npm;
- Docker e Docker Compose;
- PostgreSQL;
- Redis opcional.

## Instalar dependencias

Dentro da pasta do backend:

```bash
cd backend
npm install
```

Depois gere o Prisma Client:

```bash
npm run db:generate
```

## Variaveis de ambiente

Crie o arquivo de desenvolvimento a partir do exemplo:

```bash
cp .env.example .env.dev
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.dev
```

Variaveis principais:

```env
NODE_ENV=development
PORT=3333
HOST=0.0.0.0
BASE_URL=http://localhost:3333
API_TOKEN=case-eventos-dev-token
DATABASE_URL=postgresql://case_eventos:case_eventos@localhost:5432/case_eventos?schema=public
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=60
```

Para rodar sem Redis, deixe:

```env
REDIS_URL=
```

## Rodando com Docker Compose local

Na raiz do projeto:

```bash
docker compose up -d postgres redis
```

Se quiser subir backend junto via Docker:

```bash
docker compose up -d backend
```

Ou subir tudo:

```bash
docker compose up -d
```

## Rodando backend em desenvolvimento local

Com PostgreSQL e Redis no ar:

```bash
cd backend
npm run db:migrate
npm run dev
```

URLs esperadas:

- API: `http://localhost:3333`;
- Swagger: `http://localhost:3333/docs`;
- OpenAPI JSON: `http://localhost:3333/docs.json`;
- Health: `http://localhost:3333/health`.

## Rodando migrations

Em desenvolvimento:

```bash
npm run db:migrate
```

Em ambiente de producao ou container:

```bash
npm run db:deploy
```

## Rodando seed

```bash
npm run db:seed
```

O seed cria dados fake para teste, incluindo um evento com 1000 participantes
inscritos.

## Rodando testes

Suite principal:

```bash
npm test
```

Testes com banco real:

```bash
npm run test:database
```

Checagens estaticas:

```bash
npm run typecheck
npm run lint
npm run build
```

## Teste manual rapido

### 1. Health

```bash
curl http://localhost:3333/health
```

### 2. Criar evento

```bash
curl -X POST http://localhost:3333/events \
  -H "Authorization: Bearer case-eventos-dev-token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tech Summit","description":"Evento de tecnologia","date":"2026-07-10T15:00:00.000Z"}'
```

### 3. Criar participante

```bash
curl -X POST http://localhost:3333/participants \
  -H "Authorization: Bearer case-eventos-dev-token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Souza","email":"ana@email.com","phone":"11999999999"}'
```

### 4. Inscrever participante

```bash
curl -X POST http://localhost:3333/events/<eventId>/participants \
  -H "Authorization: Bearer case-eventos-dev-token" \
  -H "Content-Type: application/json" \
  -d '{"participantId":"<participantId>"}'
```

### 5. Listar participantes do evento

```bash
curl "http://localhost:3333/events/<eventId>/participants?page=1&limit=20&search=ana" \
  -H "Authorization: Bearer case-eventos-dev-token"
```

## Scripts uteis

| Script                                  | Uso                                      |
| --------------------------------------- | ---------------------------------------- |
| `npm run dev`                           | Inicia API em watch mode                 |
| `npm start`                             | Inicia build em `dist`                   |
| `npm run build`                         | Compila TypeScript                       |
| `npm run db:generate`                   | Gera Prisma Client                       |
| `npm run db:migrate`                    | Roda migrations em desenvolvimento       |
| `npm run db:deploy`                     | Aplica migrations em ambiente controlado |
| `npm run db:seed`                       | Popula banco com dados fake              |
| `npm test`                              | Roda suite principal                     |
| `npm run test:database`                 | Roda testes com banco real               |
| `npm run perf:event-participants`       | Executa teste de performance pontual     |
| `npm run perf:event-participants:sweep` | Executa varredura de carga               |
