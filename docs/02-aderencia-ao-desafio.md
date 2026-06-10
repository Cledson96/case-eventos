# Aderencia ao Desafio

## Objetivo deste capitulo

Este capitulo mapeia os requisitos do teste tecnico para a implementacao
entregue. A ideia e facilitar a leitura do avaliador e mostrar onde cada item
foi atendido.

## Back-end

### Stack pedida

| Requisito  | Entrega                     |
| ---------- | --------------------------- |
| Node.js    | Backend em Node.js 22       |
| TypeScript | TypeScript strict           |
| PostgreSQL | PostgreSQL via Prisma       |
| Express.js | Express 5                   |
| ORM        | Prisma 7                    |
| Migrations | `backend/prisma/migrations` |

### Rotas obrigatorias

| Rota pedida                          | Status | Implementacao                   |
| ------------------------------------ | ------ | ------------------------------- |
| `POST /events`                       | Feita  | Cria evento                     |
| `POST /participants`                 | Feita  | Cria participante               |
| `POST /events/:eventId/participants` | Feita  | Inscreve participante em evento |
| `GET /events/:eventId/participants`  | Feita  | Lista participantes do evento   |

### Rotas complementares

| Rota                                  | Motivo                               |
| ------------------------------------- | ------------------------------------ |
| `GET /events`                         | Necessaria para listagem no frontend |
| `GET /events/:eventId`                | Necessaria para detalhe no frontend  |
| `DELETE /events/:eventId`             | Administracao basica de eventos      |
| `GET /participants`                   | Busca por e-mail e listagem          |
| `DELETE /participants/:participantId` | Remocao de participantes             |
| `/health`, `/livez`, `/readyz`        | Operacao e deploy                    |
| `/docs`, `/docs.json`                 | Swagger/OpenAPI                      |

## Front-end

### Stack pedida

| Requisito                 | Entrega                                  |
| ------------------------- | ---------------------------------------- |
| React                     | React 19                                 |
| TypeScript                | TypeScript strict                        |
| Next.js                   | Next.js 16 com App Router                |
| Axios                     | Axios no cliente HTTP e Route Handlers   |
| Redux ou Context opcional | Context API para toasts                  |
| Sem biblioteca de UI      | Componentes proprios com Tailwind CSS v4 |

### Telas obrigatorias

| Tela pedida                                    | Status | Implementacao      |
| ---------------------------------------------- | ------ | ------------------ |
| Pagina de listagem de eventos                  | Feita  | `/events`          |
| Pagina de detalhes de evento com participantes | Feita  | `/events/:eventId` |
| Formulario de criacao de eventos               | Feita  | `/events/new`      |
| Formulario de inscricao de participantes       | Feita  | detalhe do evento  |

## Criterios de avaliacao

### Organizacao e estrutura

O projeto e organizado como monorepo:

```text
backend/
frontend/
deploy/
scripts/
docs/
```

Cada parte possui responsabilidade propria e documentacao tecnica separada.

### Clareza na implementacao

O backend separa:

- routes;
- controllers;
- services;
- repositories;
- schemas;
- docs;
- infrastructure;
- shared.

O frontend separa:

- app routes;
- components;
- services;
- lib;
- hooks;
- utils;
- types.

### TypeScript

TypeScript e usado de ponta a ponta:

- DTOs e schemas no backend;
- tipos de entidades e responses no frontend;
- validacao de envs;
- paginacao tipada;
- services tipados.

### Separacao de responsabilidades

O backend evita regra de negocio em controller e acesso a banco fora de
repository. O frontend evita expor token ao browser e usa Route Handlers como
BFF para escritas.

### Git

O trabalho foi feito em branch `development`, com commits em portugues e no
padrao Conventional Commits.

### Aplicacao funcional

A aplicacao roda localmente, via Docker e em deploy por VPS. O fluxo completo
foi validado:

1. criar evento;
2. criar participante;
3. inscrever em evento;
4. listar participantes;
5. buscar participantes;
6. paginar resultados.

## Complementos tecnicos

Alem do pedido minimo, o projeto inclui:

- Swagger/OpenAPI;
- Redis cache opcional;
- seed com evento de 1000 participantes;
- testes unitarios, HTTP, banco e frontend;
- scripts de performance;
- Dockerfiles;
- Docker Compose;
- CI e deploy via GitHub Actions;
- documentacao tecnica completa.

## Conclusao

O projeto atende o escopo obrigatorio do teste e adiciona complementos
proporcionais para demonstrar maturidade tecnica sem fugir do objetivo:
entregar uma aplicacao fullstack simples, organizada, tipada e funcional.
