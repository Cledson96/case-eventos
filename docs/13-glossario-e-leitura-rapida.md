# Glossario e Leitura Rapida

## Objetivo deste capitulo

Este capitulo define termos usados no projeto e oferece uma trilha rapida de
leitura para avaliacao.

## Glossario

### API

Backend HTTP em Express responsavel por eventos, participantes e inscricoes.

### BFF

Backend for Frontend. No projeto, sao os Route Handlers do Next.js em
`frontend/src/app/api`.

### Cache

Armazenamento temporario em Redis para respostas de leitura.

### CI

Pipeline de integracao continua que valida lint, typecheck, testes e build.

### Deploy

Processo de publicar imagens Docker no GHCR e atualizar containers na VPS.

### Docker Compose

Arquivo que orquestra Postgres, Redis, backend e frontend.

### Event

Evento cadastrado no sistema.

### EventParticipant

Relacao entre evento e participante. Representa inscricao.

### Frontend

Aplicacao Next.js com React, TypeScript, Tailwind e Axios.

### GHCR

GitHub Container Registry, usado para armazenar imagens Docker do projeto.

### Migration

Arquivo versionado que altera o schema do banco.

### Participant

Pessoa cadastrada para participar de eventos.

### Prisma

ORM usado no backend para schema, migrations e consultas.

### Route Handler

Rota HTTP interna do Next.js.

### Server Component

Componente React renderizado no servidor pelo Next.js.

### Swagger

Interface visual da documentacao OpenAPI do backend.

### TTL

Tempo de vida de uma chave de cache.

### VPS

Servidor privado usado para hospedar os containers.

## Leitura rapida para avaliador

### Para validar requisitos

Leia:

```text
docs/02-aderencia-ao-desafio.md
```

### Para entender arquitetura

Leia:

```text
docs/04-arquitetura-fullstack.md
backend/docs/04-arquitetura.md
frontend/docs/04-arquitetura.md
```

### Para rodar o projeto

Leia:

```text
README.md
docs/09-execucao-local-e-docker.md
```

### Para validar qualidade

Leia:

```text
docs/11-testes-qualidade-e-performance.md
backend/docs/10-testes-validacao.md
frontend/docs/10-testes-validacao.md
```

### Para entender deploy

Leia:

```text
docs/10-deploy-ci-cd-e-operacao.md
backend/docs/09-deploy-operacao.md
frontend/docs/09-deploy-operacao.md
```

### Para entender decisoes

Leia:

```text
docs/12-decisoes-tecnicas-e-tradeoffs.md
```

## Resumo executivo

O Case Eventos e uma aplicacao fullstack simples, mas estruturada com padroes
profissionais:

- backend REST com Express, TypeScript, Prisma e PostgreSQL;
- frontend com Next.js, React, TypeScript e Tailwind;
- migrations versionadas;
- Swagger;
- Docker;
- CI/CD;
- testes;
- cache opcional;
- documentacao completa.

O resultado atende o desafio e demonstra organizacao, clareza e boas praticas
de engenharia.
