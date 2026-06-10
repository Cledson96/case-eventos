# Backend em Alto Nivel

## Objetivo deste capitulo

Este capitulo resume o backend para a documentacao geral. Os detalhes completos
ficam em `backend/docs`.

## Stack

| Area      | Tecnologia          |
| --------- | ------------------- |
| Runtime   | Node.js 22          |
| Linguagem | TypeScript strict   |
| HTTP      | Express 5           |
| ORM       | Prisma 7            |
| Banco     | PostgreSQL          |
| Cache     | Redis com `ioredis` |
| Validacao | Zod                 |
| Logs      | Pino                |
| Docs      | Swagger/OpenAPI     |
| Testes    | Vitest e Supertest  |

## Modulos

O backend possui dois modulos principais:

- `events`;
- `participants`.

O modulo `events` tambem concentra inscricao e listagem de participantes de um
evento, porque essa relacao nasce a partir de um evento.

## Estrutura

```text
backend/src/
  infrastructure/
    cache/
    database/
  modules/
    events/
    participants/
  shared/
  index.ts
  server.ts
```

## Principais endpoints

Eventos:

- `POST /events`;
- `GET /events`;
- `GET /events/:eventId`;
- `DELETE /events/:eventId`;
- `POST /events/:eventId/participants`;
- `GET /events/:eventId/participants`.

Participantes:

- `POST /participants`;
- `GET /participants`;
- `DELETE /participants/:participantId`.

Operacao:

- `GET /health`;
- `GET /livez`;
- `GET /readyz`;
- `GET /docs`;
- `GET /docs.json`.

## Banco e migrations

As migrations ficam em:

```text
backend/prisma/migrations
```

Modelos principais:

- `Event`;
- `Participant`;
- `EventParticipant`.

`EventParticipant` usa chave composta para impedir que o mesmo participante
seja inscrito duas vezes no mesmo evento.

## Cache opcional

Redis e usado para cache de leituras, mas nao e obrigatorio para a API
funcionar.

Se `REDIS_URL` estiver vazia ou Redis estiver indisponivel, o backend segue sem
cache.

## Swagger

Swagger fica disponivel em:

```text
http://localhost:3333/docs
http://localhost:3333/docs.json
```

A documentacao e modular, com blocos por modulo em:

```text
backend/src/modules/*/docs
```

## Seguranca

O backend usa:

- Bearer token;
- Helmet;
- CORS allowlist;
- rate limit;
- body limit;
- request id;
- erros padronizados.

## Testes

O backend possui:

- testes unitarios;
- testes HTTP com Supertest;
- testes de banco real;
- testes de cache;
- testes de seed;
- testes de scripts de performance;
- testes de Swagger.

## Documentacao especifica

Para detalhes internos, consulte:

```text
backend/docs/
```
