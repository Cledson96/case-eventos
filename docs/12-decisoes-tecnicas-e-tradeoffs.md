# Decisoes Tecnicas e Tradeoffs

## Objetivo deste capitulo

Este capitulo registra decisoes importantes do projeto e os tradeoffs
envolvidos. A ideia e mostrar que as escolhas foram proporcionais ao escopo do
case.

## Monorepo

O projeto usa monorepo com `backend` e `frontend`.

Vantagens:

- facilita avaliacao;
- facilita docker compose local;
- centraliza deploy;
- evita repos separados para um case pequeno.

Tradeoff:

- pipelines precisam separar jobs por pasta.

## Express em vez de framework maior

Express foi suficiente para o escopo REST do teste.

Vantagens:

- simples;
- conhecido;
- compativel com Supertest e Swagger;
- pouco overhead.

Tradeoff:

- exige organizar manualmente camadas e padroes.

## Prisma

Prisma foi escolhido para ORM e migrations.

Vantagens:

- schema claro;
- client tipado;
- migrations versionadas;
- boa experiencia com TypeScript.

Tradeoff:

- adiciona geracao de client e cuidado com versoes.

## Redis opcional

Redis melhora leituras, mas a API nao depende dele.

Vantagens:

- melhora performance;
- demonstra infraestrutura;
- nao derruba a API se falhar.

Tradeoff:

- adiciona complexidade de invalidacao.

## Bearer token simples

Foi usado token simples em vez de login.

Vantagens:

- protege rotas de dominio;
- atende o case sem escopo extra;
- simples para Swagger, frontend e deploy.

Tradeoff:

- nao representa usuarios reais nem permissoes por perfil.

## Next.js com BFF

O frontend usa Route Handlers como BFF para escritas.

Vantagens:

- token nao fica no browser;
- erros podem ser normalizados;
- componentes client-side continuam simples.

Tradeoff:

- existe uma camada a mais entre formulario e backend.

## Context API em vez de Redux

Redux nao foi usado porque nao havia estado global complexo.

Vantagens:

- menos dependencia;
- menos boilerplate;
- estado de servidor fica no servidor.

Tradeoff:

- se a aplicacao crescer muito, pode ser necessario reavaliar.

## Tailwind sem biblioteca de UI

Tailwind foi usado para criar componentes proprios.

Vantagens:

- atende requisito de nao usar Material UI ou Bootstrap;
- permite identidade visual propria;
- reduz dependencia de componentes externos.

Tradeoff:

- exige construir estados e componentes manualmente.

## Paginacao no frontend

Listagens usam paginacao mesmo quando o case minimo nao exige.

Vantagens:

- escala com dados maiores;
- combina com seed de 1000 participantes;
- reduz peso da UI.

Tradeoff:

- adiciona query params e navegacao.

## Seed com volume alto

O seed cria um evento com 1000 participantes.

Vantagens:

- facilita demonstracao;
- valida paginacao;
- permite teste de performance.

Tradeoff:

- seed pode ser pesado para ambientes pequenos se usado sem criterio.

## Deploy em VPS

O projeto inclui deploy realista com Docker, GHCR, nginx e certbot.

Vantagens:

- demonstra operacao;
- separa development e production;
- VPS nao faz build.

Tradeoff:

- exige secrets e DNS configurados.

## Decisao geral

As escolhas adicionam maturidade sem transformar o case em um produto grande.
O foco continua sendo uma aplicacao simples, funcional e bem organizada.
