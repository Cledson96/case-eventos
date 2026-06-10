# Seed, Performance e Carga

## Objetivo deste capitulo

Este capitulo documenta o seed de dados fake e os scripts de performance do
backend. O foco e explicar como gerar massa de teste e como interpretar os
resultados de carga.

## Seed

O seed fica em:

```text
prisma/seed.ts
```

Ele usa Faker para gerar dados realistas de eventos e participantes.

Comando:

```bash
npm run db:seed
```

## Dados gerados

O seed cria:

- eventos de exemplo;
- participantes fake;
- inscricoes;
- um evento principal com pelo menos 1000 participantes inscritos.

Esse evento grande existe para testar paginacao, busca, ordenacao e carga em
um volume maior do que os exemplos triviais.

## Quando usar seed

Use seed em:

- ambiente local;
- ambiente de development;
- ambiente de demo;
- validacao manual do frontend;
- testes exploratorios de performance.

Evite rodar seed automaticamente em producao real, a menos que o ambiente de
producao seja apenas demonstrativo.

## Seed no deploy

O deploy aceita:

```text
RUN_SEED_ON_DEPLOY=true
```

Quando habilitado, o container backend aplica migrations e roda seed antes de
iniciar a API.

## Scripts de performance

Existem dois scripts principais:

```bash
npm run perf:event-participants
npm run perf:event-participants:sweep
```

Eles ficam em:

```text
scripts/performance
```

## Objetivo dos scripts

Os scripts testam o endpoint:

```text
GET /events/:eventId/participants
```

Esse endpoint e uma boa escolha para carga porque combina:

- autenticacao;
- paginacao;
- busca opcional;
- ordenacao por campos relacionados;
- consulta em relacao muitos-para-muitos;
- cache Redis quando disponivel.

## Configuracao esperada

Antes de rodar performance:

1. suba a API;
2. aplique migrations;
3. rode seed;
4. confirme que existe evento com 1000 participantes;
5. configure token e URL base se necessario.

Exemplo:

```bash
PERF_BASE_URL=http://localhost:3333
API_TOKEN=case-eventos-dev-token
npm run perf:event-participants
```

No PowerShell:

```powershell
$env:PERF_BASE_URL="http://localhost:3333"
$env:API_TOKEN="case-eventos-dev-token"
npm run perf:event-participants
```

## Sweep de carga

O script `perf:event-participants:sweep` executa cenarios progressivos para
observar como a API se comporta conforme aumenta a quantidade de requisicoes.

Ele ajuda a responder perguntas como:

- a API continua respondendo sob concorrencia maior?
- o tempo medio aumenta muito?
- ha diferenca entre cache frio e cache quente?
- o rate limit interfere no teste?
- o banco vira gargalo?

## Interpretacao dos resultados

Os scripts ajudam a medir comportamento, mas nao definem sozinhos o limite real
da API.

O limite depende de:

- CPU e memoria da maquina;
- configuracao do PostgreSQL;
- disponibilidade do Redis;
- tamanho das paginas;
- uso de `search`;
- concorrencia;
- rate limit;
- latencia entre cliente, API e banco;
- ambiente local, Docker ou VPS.

## Cuidados ao testar carga

Antes de interpretar qualquer numero:

- rode contra um ambiente estavel;
- garanta que o seed foi aplicado;
- confirme se Redis esta habilitado ou nao;
- rode o mesmo teste mais de uma vez;
- observe logs do backend;
- observe CPU e memoria dos containers;
- nao confunda limite local com limite de VPS.

## Cache e performance

O cache pode melhorar bastante listagens repetidas com os mesmos parametros.

Exemplo de chave:

```text
events:<eventId>:participants:page=1:limit=20:search=:sort=createdAt:order=desc
```

Quando o mesmo endpoint e chamado com os mesmos parametros, a segunda chamada
pode vir do Redis. Quando evento, participante ou inscricao muda, as chaves
relacionadas sao invalidadas.

## Como usar em demonstracao

Um roteiro simples:

1. Rode seed.
2. Abra o frontend ou Swagger.
3. Liste eventos.
4. Abra o evento com 1000 participantes.
5. Teste paginacao.
6. Busque por nome ou e-mail.
7. Rode `perf:event-participants`.
8. Mostre que a API continua respondendo e que o contrato paginado permanece
   estavel.
