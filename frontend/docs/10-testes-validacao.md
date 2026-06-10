# Testes e Validacao

## Objetivo deste capitulo

Este capitulo mostra como o frontend e validado tecnicamente: suite
automatizada, checagens estaticas, build e validacao manual.

## Filosofia de validacao

O frontend foi construido para um case tecnico, entao os testes precisam
demonstrar comportamento real de interface:

- formularios enviam payload correto;
- erros e toasts aparecem para o usuario;
- paginacao preserva query params;
- validacoes impedem dados ruins;
- mascaras formatam valores;
- datas sao exibidas corretamente;
- a interface evita duplo submit.

## Suite principal

Comando:

```bash
npm test
```

A suite usa Vitest e Testing Library.

Ela cobre:

- validacoes;
- mascaras;
- formatacao de datas;
- extracao de erro;
- criacao de evento;
- lista de participantes;
- busca de participantes;
- paginacao.

## Testes de componentes

Os testes de componentes renderizam a UI e interagem como usuario:

- `CreateEventForm.test.tsx`;
- `ParticipantList.test.tsx`;
- `ParticipantSearch.test.tsx`;
- `Pagination.test.tsx`.

Eles usam mocks de `axios` e `next/navigation` quando necessario.

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

Valida regras do ESLint, incluindo regras do Next e React Hooks.

## Build

Comando:

```bash
npm run build
```

Gera o build de producao do Next.

Esse comando valida:

- compilacao;
- rotas App Router;
- tipos de paginas;
- bundle de producao;
- standalone output usado pelo Docker.

## Validacao manual recomendada

### 1. Home

Abrir:

```text
http://localhost:3000
```

Validar se proximos eventos aparecem quando a API esta disponivel.

### 2. Listagem de eventos

Abrir:

```text
http://localhost:3000/events
```

Validar cards, datas, links e paginacao quando houver mais de uma pagina.

### 3. Criacao de evento

Abrir:

```text
http://localhost:3000/events/new
```

Preencher campos, validar preview e confirmar redirecionamento apos sucesso.

### 4. Detalhe do evento

Abrir um evento e validar:

- dados do evento;
- busca de participantes;
- paginacao;
- inscricao;
- exclusao;
- toasts.

### 5. Erros

Parar o backend e validar se as rotas mostram estado de erro com opcao de
tentar novamente.

## Comandos de validacao final

Antes de considerar o frontend pronto:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Para validar Docker:

```bash
docker compose build frontend
docker compose up -d frontend
```

## O que cada comando prova

| Comando                         | Prova                           |
| ------------------------------- | ------------------------------- |
| `npm test`                      | Comportamentos principais de UI |
| `npm run typecheck`             | Tipagem TypeScript              |
| `npm run lint`                  | Consistencia estatica           |
| `npm run build`                 | Build de producao               |
| `docker compose build frontend` | Imagem Docker builda            |
| Browser manual                  | Navegacao real e responsividade |
