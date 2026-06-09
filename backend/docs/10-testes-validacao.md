# Testes e Validacao

## Objetivo deste capitulo

Este capitulo mostra como o backend e validado tecnicamente: suite
automatizada, testes de banco, checagens estaticas, build e validacao manual.

## Filosofia de validacao

O backend foi construido para um case tecnico, entao os testes precisam provar
mais do que "a rota responde". Eles devem demonstrar:

- regras de negocio corretas;
- contratos HTTP coerentes;
- validacao de entrada;
- persistencia funcionando com migrations reais;
- cache resiliente;
- Swagger gerado corretamente no ambiente de build;
- scripts auxiliares funcionando.

## Suite principal

Comando:

```bash
npm test
```

A suite principal usa Vitest e cobre:

- services de eventos;
- services de participantes;
- repositories;
- schemas Zod;
- cache Redis;
- paginacao;
- valida request middleware;
- seed;
- scripts auxiliares;
- Swagger;
- rotas HTTP com Supertest;
- performance scripts em nivel unitario.

## Testes HTTP

Os testes HTTP usam Supertest contra a instancia Express exportada por
`src/server.ts`.

Eles validam:

- autenticacao;
- health e docs;
- criacao e listagem de eventos;
- criacao e listagem de participantes;
- inscricao em evento;
- erros esperados.

## Testes de banco

Comando:

```bash
npm run test:database
```

Esse comando:

1. resolve a `DATABASE_TEST_URL`;
2. garante que o banco de teste existe;
3. aplica migrations com `prisma migrate deploy`;
4. roda Vitest com `vitest.database.config.ts`.

Esses testes validam comportamento com PostgreSQL real, incluindo relacoes e
indices.

## Typecheck

Comando:

```bash
npm run typecheck
```

Valida a tipagem TypeScript sem gerar build.

## Lint

Comando:

```bash
npm run lint
```

Valida padroes estaticos de codigo.

## Build

Comando:

```bash
npm run build
```

O build executa:

```bash
tsc && tsc-alias --resolve-full-paths --resolve-full-extension .js
```

Isso compila TypeScript para `dist` e resolve aliases para imports com
extensao `.js`.

## Validacao do Swagger no build

Existe teste especifico para garantir que os blocos `@swagger` dos endpoints
sao preservados no JavaScript emitido.

Esse teste protege contra um problema comum: o TypeScript pode remover
comentarios soltos no build. Como o Swagger de producao le arquivos em `dist`,
os comentarios precisam sobreviver a compilacao.

## Validacao manual recomendada

### 1. Health

```bash
curl http://localhost:3333/health
```

### 2. Swagger JSON

```bash
curl http://localhost:3333/docs.json
```

Validar se `paths` contem:

- `/events`;
- `/events/{eventId}`;
- `/events/{eventId}/participants`;
- `/participants`;
- `/participants/{participantId}`.

### 3. Fluxo funcional completo

1. Criar evento.
2. Criar participante.
3. Inscrever participante.
4. Listar participantes do evento.
5. Buscar com `search`.
6. Validar erro de inscricao duplicada.

## Comandos de validacao final

Antes de considerar o backend pronto:

```bash
npm run typecheck
npm run lint
npm test
npm run test:database
npm run build
```

Para validar Docker:

```bash
docker compose build backend
docker compose up -d backend
curl http://localhost:3333/health
curl http://localhost:3333/docs.json
```

## O que cada comando prova

| Comando                        | Prova                         |
| ------------------------------ | ----------------------------- |
| `npm test`                     | Regras e contratos principais |
| `npm run test:database`        | Migrations e banco real       |
| `npm run typecheck`            | Tipagem TypeScript            |
| `npm run lint`                 | Consistencia estatica         |
| `npm run build`                | Build de producao             |
| `docker compose build backend` | Imagem Docker builda          |
| `curl /health`                 | API responde                  |
| `curl /docs.json`              | Swagger gerado corretamente   |
