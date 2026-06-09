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

## Docker

Para subir a aplicacao completa com PostgreSQL, Redis, backend e frontend:

```bash
docker compose up --build
```

URLs principais:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3333`
- Swagger: `http://localhost:3333/docs`

Para subir somente o backend com banco e Redis:

```bash
docker compose up --build backend
```

Para subir somente o frontend usando um backend externo ou local:

```bash
FRONTEND_API_URL=http://host.docker.internal:3333 docker compose up --build frontend
```

No PowerShell:

```powershell
$env:FRONTEND_API_URL="http://host.docker.internal:3333"
docker compose up --build frontend
```

Variaveis aceitas pelo compose:

```env
API_TOKEN=case-eventos-dev-token
CACHE_TTL_SECONDS=60
FRONTEND_API_URL=http://backend:3333
FRONTEND_BUILD_API_URL=http://backend:3333
```

## Deploy VPS com GitHub Actions

O projeto possui workflows para CI e deploy Docker em VPS:

- `.github/workflows/ci.yml`: valida backend e frontend em pushes e pull requests para `development` e `main`.
- `.github/workflows/deploy.yml`: builda imagens no GHCR e faz deploy na VPS.

Fluxo de ambientes:

- Push na branch `development`: deploy no Environment `development`.
- Push na branch `main`: deploy no Environment `production`.
- `workflow_dispatch`: permite disparar manualmente o deploy do ambiente correspondente a branch.

As imagens publicadas seguem o formato:

```txt
ghcr.io/cledson96/case-eventos-backend:<sha>
ghcr.io/cledson96/case-eventos-frontend:<sha>
```

Na VPS, o deploy usa:

- `deploy/docker-compose.vps.yml`
- `scripts/deploy-docker.sh`
- `deploy/nginx/reverse-proxy-http.conf`
- `deploy/nginx/reverse-proxy-https.conf`

A VPS nao builda a aplicacao. Ela apenas faz pull das imagens do GHCR, sobe os containers com Docker Compose, publica nginx em loopback e emite certificado TLS com certbot quando necessario.

Configure os Environments `development` e `production` no GitHub com os mesmos nomes de secrets e vars, mudando apenas os valores.

Secrets obrigatorios:

```txt
VPS_HOST
VPS_USER
VPS_SSH_KEY
API_TOKEN
POSTGRES_PASSWORD
```

Secrets opcionais:

```txt
VPS_PORT
CERTBOT_EMAIL
DATABASE_URL
GHCR_PULL_TOKEN
```

Vars obrigatorias:

```txt
FRONTEND_DOMAIN
BACKEND_DOMAIN
```

Vars recomendadas por ambiente:

```txt
DEPLOY_PATH=/opt/case-eventos-development
COMPOSE_PROJECT_NAME=case-eventos-development
FRONTEND_PORT=3001
BACKEND_PORT=3334
FRONTEND_PUBLIC_URL=https://eventos-dev.seudominio.com
ALLOWED_ORIGINS=https://eventos-dev.seudominio.com
```

Para `production`, use outro `DEPLOY_PATH`, outro `COMPOSE_PROJECT_NAME` e dominios de producao. O usuario SSH precisa ter permissao de `sudo` para instalar e gerenciar Docker, nginx e certbot. Antes do primeiro deploy com TLS, os registros DNS dos dominios devem apontar para a VPS e a porta `80` deve estar liberada.

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

Os endpoints protegidos tambem estao marcados no Swagger em `/docs` e `/docs.json`.

## Erros

As respostas de erro seguem o mesmo formato em toda a API:

```json
{
  "success": false,
  "message": "Dados da requisicao invalidos",
  "error": {
    "code": 400,
    "details": {}
  },
  "timestamp": "2026-06-08T20:28:08.222Z"
}
```

Status principais:

- `400`: dados, parametros ou ids invalidos.
- `401`: token ausente ou invalido.
- `404`: evento ou participante nao encontrado.
- `409`: e-mail duplicado ou participante ja inscrito no evento.
- `500`: erro interno do servidor.

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
