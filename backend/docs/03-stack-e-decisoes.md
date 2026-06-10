# Stack e Decisoes

## Objetivo deste capitulo

Este capitulo documenta a stack usada no backend e as principais decisoes
tecnicas. A ideia e mostrar que as escolhas foram feitas para atender o case
com clareza, tipagem, facilidade de execucao e bom custo de manutencao.

## Stack principal

| Area      | Tecnologia                                 |
| --------- | ------------------------------------------ |
| Runtime   | Node.js 22                                 |
| Linguagem | TypeScript strict                          |
| HTTP      | Express 5                                  |
| Validacao | Zod 4                                      |
| ORM       | Prisma 7                                   |
| Banco     | PostgreSQL                                 |
| Cache     | Redis via `ioredis`                        |
| Logs      | Pino e `pino-http`                         |
| Docs      | `swagger-jsdoc` e `swagger-ui-express`     |
| Testes    | Vitest e Supertest                         |
| Container | Docker e Docker Compose                    |
| Deploy    | GitHub Actions, GHCR, VPS, nginx e certbot |

## Node.js 22

O projeto usa Node.js 22 para alinhar desenvolvimento, CI e Docker com uma
versao atual de runtime. Isso reduz divergencias entre ambiente local e
producao e permite usar APIs modernas da plataforma.

## TypeScript strict

O TypeScript esta configurado com regras fortes, incluindo:

- `strict`;
- `noImplicitReturns`;
- `noUncheckedIndexedAccess`;
- `exactOptionalPropertyTypes`;
- `useUnknownInCatchVariables`;
- aliases para `@`, `@modules`, `@shared`, `@infrastructure` e outros.

Essa configuracao evita uma classe grande de erros comuns em APIs pequenas,
como retornos indefinidos, payloads ambiguos e acesso inseguro a campos
opcionais.

## Express

Express foi escolhido por ser direto, conhecido e suficiente para o escopo do
case. A aplicacao nao precisava de uma estrutura grande de framework, mas
precisava de middlewares claros, rotas REST e boa compatibilidade com
Supertest, Swagger e bibliotecas de seguranca.

## Prisma

Prisma foi usado para modelagem, migrations e acesso tipado ao PostgreSQL.

Decisoes relevantes:

- Prisma Client gerado em `src/generated/prisma`;
- migrations versionadas em `prisma/migrations`;
- uso de `@prisma/adapter-pg`;
- selects explicitos nas consultas para evitar buscar campos desnecessarios;
- tratamento centralizado de erros conhecidos do Prisma.

## PostgreSQL

PostgreSQL foi escolhido por ser o banco relacional pedido pelo case e por
modelar bem a relacao muitos-para-muitos entre eventos e participantes.

A relacao `EventParticipant` usa chave composta entre `eventId` e
`participantId`, o que impede duplicidade no nivel do banco.

## Redis

Redis foi adicionado como cache opcional para melhorar respostas de leitura.

O ponto importante e que a API nao depende do Redis para funcionar. Se
`REDIS_URL` nao existir ou o Redis estiver indisponivel, o backend segue sem
cache e registra aviso no log.

Essa decisao evita que uma dependencia auxiliar derrube a funcionalidade
principal do case.

## Zod

Zod valida:

- body;
- query params;
- route params;
- variaveis de ambiente.

A validacao HTTP acontece via middleware de rota. Assim os controllers recebem
dados ja parseados e tipados em `response.locals.validatedRequest`.

## Swagger

Swagger foi mantido no padrao modular:

- config em `src/shared/config/swagger`;
- middleware em `src/shared/middlewares/swagger`;
- blocos por modulo em `src/modules/*/docs`.

Os blocos `@swagger` sao a excecao permitida de comentario no codigo, porque
fazem parte da documentacao interativa.

## Testes

A suite usa Vitest em tres frentes principais:

- unitarios de servicos, repositories, schemas, cache, scripts e seed;
- integracao HTTP com Supertest;
- testes de banco com migrations reais.

Tambem existem testes para proteger pontos de infraestrutura, como preservacao
dos comentarios Swagger no build.

## Docker e deploy

O backend possui Dockerfile proprio e tambem participa de dois modelos de
compose:

- `docker-compose.yml` na raiz para execucao local;
- `deploy/docker-compose.vps.yml` para VPS.

No deploy, as imagens sao buildadas no GitHub Actions, publicadas no GHCR e
baixadas pela VPS. A VPS nao faz build da aplicacao.

## Decisao geral

A stack foi escolhida para equilibrar simplicidade e maturidade. O backend e
pequeno, mas nao e improvisado: possui contratos, migrations, cache opcional,
testes, Docker e deploy automatizado. Isso atende o case e deixa uma base
coerente para evolucao.
