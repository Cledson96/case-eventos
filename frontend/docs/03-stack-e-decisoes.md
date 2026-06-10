# Stack e Decisoes

## Objetivo deste capitulo

Este capitulo documenta a stack usada no frontend e as principais decisoes
tecnicas. A ideia e mostrar que as escolhas foram feitas para atender o case
com clareza, tipagem, seguranca do token e bom custo de manutencao.

## Stack principal

| Area      | Tecnologia                        |
| --------- | --------------------------------- |
| Framework | Next.js 16 com App Router         |
| UI        | React 19                          |
| Linguagem | TypeScript strict                 |
| Estilo    | Tailwind CSS v4                   |
| HTTP      | Axios                             |
| Datas     | dayjs                             |
| Testes    | Vitest e Testing Library          |
| Build     | Next standalone output            |
| Container | Docker                            |
| Deploy    | GitHub Actions, GHCR, VPS e nginx |

## Next.js App Router

Next.js foi escolhido para entregar rotas, Server Components, Route Handlers,
loading/error boundaries e build de producao em um unico framework.

O App Router permite organizar telas por rota dentro de `src/app`, mantendo
proximidade entre pagina, estados de carregamento, erro e componentes
especificos.

## Server Components

As paginas que leem dados do backend usam Server Components. Isso permite que:

- `API_TOKEN` fique apenas no servidor;
- a busca inicial aconteca antes da renderizacao da tela;
- a pagina seja entregue ja com dados ou estado de erro;
- a camada de servicos continue simples e tipada.

## Route Handlers como BFF

Os componentes client-side nao chamam o backend diretamente. Eles chamam rotas
internas em `/api`, que repassam a requisicao ao backend com o token Bearer.

Essa decisao evita expor `API_TOKEN` ao browser e centraliza o tratamento de
erros das submissoes.

## Axios

Axios foi usado por ser um requisito do case e por oferecer uma API simples
para timeout, headers e tratamento de erro.

O cliente server-side fica em `src/lib/http.ts` e desempacota o envelope da API:

```ts
{
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
```

## TypeScript strict

O frontend usa TypeScript para tipar:

- entidades de dominio;
- payloads de criacao;
- respostas paginadas;
- props de componentes;
- servicos HTTP;
- hooks de formulario.

Isso reduz erros comuns, como passar props incompletas, manipular responses
sem `data` ou montar query params inconsistentes.

## Tailwind CSS

Tailwind CSS v4 foi usado sem biblioteca de UI externa. Os componentes visuais
sao proprios e pequenos, alinhados ao requisito do case.

As classes ficam diretamente nos componentes, enquanto tokens globais de cor
ficam em `src/app/globals.css`.

## Context API

Context API foi usada apenas para toasts, porque e um estado transversal
pequeno. Nao foi necessario adicionar Redux, ja que os dados principais sao
server-side e recarregados com `router.refresh()`.

## dayjs

dayjs centraliza formatacao de datas em `src/utils/date.ts`. A aplicacao usa
datas em portugues do Brasil, alinhadas ao publico do case.

## Testes

Vitest e Testing Library cobrem componentes interativos, validacoes, mascaras,
formatacao e comportamentos de UI.

Os testes focam em comportamento observavel pelo usuario, como envio de
formularios, mensagens de sucesso, paginacao e exibicao de dados.

## Decisao geral

A stack foi escolhida para equilibrar simplicidade e maturidade. O frontend e
pequeno, mas nao e improvisado: possui BFF, tipagem, estados de UI, validacao,
testes, Docker e deploy.
