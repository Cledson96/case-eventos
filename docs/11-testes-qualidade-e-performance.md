# Testes, Qualidade e Performance

## Objetivo deste capitulo

Este capitulo resume como o projeto e validado em qualidade, testes, build e
performance.

## Qualidade geral

O projeto usa:

- TypeScript strict;
- ESLint;
- Prettier;
- Vitest;
- Supertest;
- Testing Library;
- migrations reais;
- Docker build;
- CI no GitHub Actions.

## Testes do backend

Comando principal:

```bash
cd backend
npm test
```

Cobre:

- services;
- repositories;
- schemas;
- cache;
- HTTP com Supertest;
- Swagger;
- seed;
- scripts auxiliares.

## Testes de banco

```bash
cd backend
npm run test:database
```

Esse comando aplica migrations em banco de teste e valida comportamento com
PostgreSQL real.

## Testes do frontend

```bash
cd frontend
npm test
```

Cobre:

- formularios;
- validacoes;
- mascaras;
- datas;
- erros;
- paginacao;
- lista e busca de participantes.

## Typecheck

Backend:

```bash
cd backend
npm run typecheck
```

Frontend:

```bash
cd frontend
npm run typecheck
```

## Lint

Backend:

```bash
cd backend
npm run lint
```

Frontend:

```bash
cd frontend
npm run lint
```

## Build

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## Performance backend

O backend possui scripts para testar carga no endpoint de participantes do
evento seedado.

Teste pontual:

```bash
cd backend
npm run perf:event-participants
```

Sweep de conexoes:

```bash
npm run perf:event-participants:sweep
```

Variaveis uteis:

```env
PERF_BASE_URL=http://localhost:3333
PERF_CONNECTIONS=10
PERF_DURATION_SECONDS=10
PERF_LIMIT=100
PERF_PIPELINING=1
PERF_SWEEP_CONNECTIONS=5,10,25,50,100
```

## Performance frontend

O frontend evita carregar listas grandes sem paginacao:

- eventos usam `limit=12`;
- participantes usam `limit=10`;
- busca preserva query e pagina;
- textos longos usam truncamento;
- leituras principais sao server-side.

## Validacao final recomendada

Na raiz, apos subir dependencias:

```bash
cd backend
npm run lint
npm run typecheck
npm test
npm run test:database
npm run build

cd ../frontend
npm run lint
npm run typecheck
npm test
npm run build
```

## Evidencias de maturidade

Pontos que demonstram cuidado tecnico:

- testes em mais de uma camada;
- banco real em suite dedicada;
- Swagger protegido contra regressao de build;
- cache opcional;
- Docker local e VPS;
- documentacao tecnica;
- commits organizados.
