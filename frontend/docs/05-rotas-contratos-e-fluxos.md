# Rotas, Contratos e Fluxos

## Objetivo deste capitulo

Este capitulo descreve as rotas da interface, os contratos internos usados
pelo frontend e como os fluxos principais conversam com o backend.

## Rotas publicas da interface

### `GET /`

Pagina inicial. Busca proximos eventos via `eventsService.listUpcoming(3)`.

Se a API estiver indisponivel, a pagina continua carregando com lista vazia.
Essa decisao evita que a home quebre por uma falha momentanea do backend.

### `GET /events`

Lista eventos paginados.

Query:

| Campo  | Descricao                    |
| ------ | ---------------------------- |
| `page` | Pagina atual, iniciando em 1 |

Parametros enviados ao backend:

```ts
{
  page,
  limit: 12,
  sort: "date",
  order: "asc"
}
```

### `GET /events/new`

Tela de criacao de evento. O formulario envia dados para a rota interna
`POST /api/events`.

### `GET /events/:eventId`

Detalhe do evento. Busca o evento e os participantes em paralelo.

Query:

| Campo    | Descricao                               |
| -------- | --------------------------------------- |
| `page`   | Pagina de participantes, iniciando em 1 |
| `search` | Filtro por nome, e-mail ou telefone     |

Parametros enviados ao backend:

```ts
{
  page,
  limit: 10,
  search,
  sort: "createdAt",
  order: "desc"
}
```

Se o backend retornar `404`, a pagina chama `notFound()`.

## Route Handlers internos

### `POST /api/events`

Entrada esperada:

```json
{
  "name": "Tech Summit",
  "description": "Evento de tecnologia",
  "date": "2026-07-10T15:00"
}
```

Comportamento:

1. valida se o corpo e JSON;
2. chama `eventsService.create`;
3. retorna o evento criado com status `201`;
4. propaga mensagem e status quando o backend retorna erro.

### `POST /api/events/:eventId/participants`

Entrada esperada:

```json
{
  "name": "Ana Souza",
  "email": "ana@email.com",
  "phone": "(11) 99999-9999"
}
```

Comportamento:

1. tenta localizar participante pelo e-mail;
2. se nao existir, cria participante;
3. inscreve participante no evento;
4. retorna participante inscrito;
5. propaga erro de duplicidade quando a inscricao ja existe.

### `DELETE /api/participants/:participantId`

Remove participante pelo identificador.

Comportamento:

1. chama `participantsService.delete`;
2. retorna participante removido;
3. propaga `404` ou outros erros retornados pelo backend.

## Contratos tipados

Os tipos principais ficam em `src/types/index.ts`:

- `Event`;
- `Participant`;
- `EventParticipant`;
- `EventSubscription`;
- `CreateEventInput`;
- `CreateParticipantInput`;
- `Paginated<T>`;
- `PaginationMeta`;
- `ListQuery`.

## Envelope da API

O backend responde com envelope padronizado:

```ts
type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};
```

O frontend desempacota esse envelope em `httpClient`, entregando aos servicos
apenas o `data` tipado.

## Erros

Erros HTTP vindos do Axios sao tratados pelos utilitarios:

- `extractErrorMessage`;
- `extractErrorStatus`.

Os formularios exibem mensagem via toast. As paginas server-side usam
`error.tsx` e `not-found.tsx` quando a falha acontece durante o carregamento.

## Refresh de dados

Apos escrita bem-sucedida, os componentes client-side chamam `router.refresh()`.

Isso atualiza os Server Components da rota atual, buscando novamente dados no
servidor sem expor o token ao browser.
