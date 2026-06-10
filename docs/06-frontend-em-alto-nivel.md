# Frontend em Alto Nivel

## Objetivo deste capitulo

Este capitulo resume o frontend para a documentacao geral. Os detalhes completos
ficam em `frontend/docs`.

## Stack

| Area      | Tecnologia               |
| --------- | ------------------------ |
| Framework | Next.js 16               |
| UI        | React 19                 |
| Linguagem | TypeScript strict        |
| Estilo    | Tailwind CSS v4          |
| HTTP      | Axios                    |
| Datas     | dayjs                    |
| Testes    | Vitest e Testing Library |

## Rotas

| Rota               | Finalidade                                        |
| ------------------ | ------------------------------------------------- |
| `/`                | Home com orientacao e proximos eventos            |
| `/events`          | Listagem paginada de eventos                      |
| `/events/new`      | Criacao de evento com previa                      |
| `/events/:eventId` | Detalhe, participantes, busca, inscricao e delete |

## Estrutura

```text
frontend/src/
  app/
  components/
  config/
  hooks/
  lib/
  services/
  types/
  utils/
```

## Server Components

As leituras principais sao feitas em Server Components. Isso protege o
`API_TOKEN`, reduz chamadas no browser e deixa a pagina chegar com dados.

## Route Handlers

As escritas feitas pelo browser passam por Route Handlers:

- `POST /api/events`;
- `POST /api/events/:eventId/participants`;
- `DELETE /api/participants/:participantId`.

Essas rotas chamam os services no lado servidor e injetam o token.

## Design system

O design system e proprio, sem Material UI, Bootstrap ou bibliotecas similares.

Principios visuais:

- base tinta sobre papel;
- ambar/mel como acento de marca;
- verde e vermelho apenas para feedback;
- componentes planos, com borda;
- foco visivel;
- estados de loading, erro e vazio.

## Estado

Nao foi usado Redux porque o projeto nao precisa de estado global complexo.

Context API foi usada para toasts. Formularios usam hook proprio `useForm`.

## Paginacao e busca

O frontend pagina:

- eventos em `/events`;
- participantes em `/events/:eventId`.

Na tela de detalhe, a busca filtra participantes por:

- nome;
- e-mail;
- telefone.

## Testes

Os testes cobrem:

- validacoes;
- mascaras;
- datas;
- extracao de erro;
- formulario de evento;
- lista de participantes;
- busca;
- paginacao.

## Documentacao especifica

Para detalhes internos, consulte:

```text
frontend/docs/
```
