# Glossario

## Objetivo deste capitulo

Este capitulo define termos usados na documentacao e no codigo do backend.

## API

Interface HTTP exposta pelo backend para criar eventos, criar participantes,
inscrever participantes e consultar dados.

## Backend

Aplicacao Node.js com Express, TypeScript, Prisma, PostgreSQL e Redis opcional.

## Bearer token

Formato simples de autenticacao usado nas rotas de dominio.

Exemplo:

```text
Authorization: Bearer case-eventos-dev-token
```

## Cache

Armazenamento temporario de respostas de leitura para reduzir consultas
repetidas ao banco.

## Cache hit

Quando a API encontra no Redis o valor de uma chave e nao precisa consultar o
banco para aquela resposta.

## Cache miss

Quando a chave nao existe no Redis ou o cache esta indisponivel, fazendo a API
consultar o banco.

## Controller

Camada que recebe a request ja validada, chama o service e envia a response.

## DTO

Objeto de transferencia de dados. No projeto, esse papel e feito principalmente
por schemas Zod e tipos TypeScript.

## Event

Modelo que representa um evento cadastravel.

## EventParticipant

Modelo de relacionamento entre evento e participante. Representa uma inscricao.

## Health check

Endpoint usado para verificar se a aplicacao esta viva ou pronta.

Rotas:

- `/health`;
- `/livez`;
- `/readyz`.

## Migration

Arquivo versionado que altera o schema do banco. No projeto, migrations sao
geradas e aplicadas pelo Prisma.

## Module

Agrupamento funcional dentro de `src/modules`. O backend possui os modulos
`events` e `participants`.

## OpenAPI

Especificacao JSON da API exposta em `/docs.json`.

## Participant

Modelo que representa uma pessoa cadastrada para participar de eventos.

## Paginacao

Padrao para dividir listagens em paginas. Usa `page`, `limit`, `total` e
`totalPages`.

## Prisma

ORM usado para modelagem, migrations e consultas ao PostgreSQL.

## Repository

Camada responsavel por acessar o banco via Prisma. Deve usar selects explicitos
e retornar dados no formato esperado pelas camadas superiores.

## Request id

Identificador unico de request propagado por `X-Request-Id` ou gerado pela API.
Ajuda a rastrear logs e erros.

## Route

Camada que mapeia metodo HTTP, caminho, validacao e controller.

## Seed

Script que popula o banco com dados fake para desenvolvimento, demonstracao e
testes manuais.

## Service

Camada de regra de negocio. Verifica existencia, duplicidade, conflitos,
invalida cache e coordena repositories.

## Swagger

Interface visual da documentacao OpenAPI, exposta em `/docs`.

## TTL

Tempo de vida de uma chave no cache. Configurado por `CACHE_TTL_SECONDS`.

## Zod

Biblioteca usada para validar entradas HTTP e variaveis de ambiente.
