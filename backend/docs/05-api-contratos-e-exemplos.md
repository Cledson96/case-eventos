# API, Contratos e Exemplos

## Objetivo deste capitulo

Este capitulo documenta a superficie HTTP do backend: convencoes, autenticacao,
endpoints, parametros, payloads e exemplos de respostas.

Para navegacao interativa, a API tambem expoe Swagger UI em `/docs` e OpenAPI
JSON em `/docs.json`.

## Convencoes gerais

### Base URL

Em ambiente local, a URL padrao e:

```text
http://localhost:3333
```

Em deploy, a URL publica usada pelo Swagger e definida por `BASE_URL`. Quando
ela nao e informada no workflow, o deploy usa `https://BACKEND_DOMAIN`.

### Autenticacao

As rotas de dominio exigem Bearer token:

```text
Authorization: Bearer case-eventos-dev-token
```

As rotas publicas sao:

- `GET /health`;
- `GET /livez`;
- `GET /readyz`;
- `GET /docs`;
- `GET /docs.json`.

### Formato de sucesso

As respostas de sucesso seguem o formato:

```json
{
  "success": true,
  "message": "Operacao realizada com sucesso",
  "data": {},
  "timestamp": "2026-06-08T20:28:08.222Z"
}
```

### Formato de erro

As respostas de erro seguem o formato:

```json
{
  "success": false,
  "message": "Dados da requisicao invalidos",
  "error": {
    "code": 400,
    "details": {}
  },
  "timestamp": "2026-06-08T20:28:08.222Z"
}
```

## Paginacao

As listagens usam:

| Query    |         Padrao | Observacao      |
| -------- | -------------: | --------------- |
| `page`   |            `1` | Comeca em 1     |
| `limit`  |           `20` | Maximo 100      |
| `search` |          vazio | Busca textual   |
| `sort`   | varia por rota | Campo permitido |
| `order`  |         `desc` | `asc` ou `desc` |

Resposta paginada:

```json
{
  "success": true,
  "message": "Eventos listados com sucesso",
  "data": {
    "data": [],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "totalPages": 0
    }
  },
  "timestamp": "2026-06-08T20:28:08.222Z"
}
```

## Health checks

### GET `/health`

Retorna status geral da API.

```json
{
  "success": true,
  "message": "API funcionando corretamente",
  "data": {
    "status": "ok",
    "uptime": 10.2,
    "environment": "development"
  }
}
```

### GET `/livez`

Indica que o processo HTTP esta vivo.

### GET `/readyz`

Indica que a API esta pronta para receber trafego e que o banco esta
conectado.

## Eventos

### POST `/events`

Cadastra um evento.

#### Request

```json
{
  "name": "Tech Summit",
  "description": "Evento de tecnologia",
  "date": "2026-07-10T15:00:00.000Z"
}
```

#### Response `201`

```json
{
  "success": true,
  "message": "Evento criado com sucesso",
  "data": {
    "id": "7ef3f7f9-cb01-4f62-8bc3-5a4f1c9d9f6a",
    "name": "Tech Summit",
    "description": "Evento de tecnologia",
    "date": "2026-07-10T15:00:00.000Z",
    "createdAt": "2026-06-08T20:28:08.222Z",
    "updatedAt": "2026-06-08T20:28:08.222Z"
  }
}
```

### GET `/events`

Lista eventos.

Campos de ordenacao permitidos:

- `createdAt`;
- `date`;
- `name`.

Exemplo:

```text
GET /events?page=1&limit=20&search=tech&sort=date&order=desc
```

### GET `/events/:eventId`

Busca evento por id.

Exemplo:

```text
GET /events/7ef3f7f9-cb01-4f62-8bc3-5a4f1c9d9f6a
```

### DELETE `/events/:eventId`

Exclui evento por id.

A exclusao remove tambem inscricoes relacionadas por causa do `onDelete:
Cascade` na relacao Prisma.

## Participantes

### POST `/participants`

Cadastra participante.

#### Request

```json
{
  "name": "Ana Souza",
  "email": "ana@email.com",
  "phone": "11999999999"
}
```

#### Response `201`

```json
{
  "success": true,
  "message": "Participante criado com sucesso",
  "data": {
    "id": "0f7127e8-2de0-44ab-9c95-29ec3e14e53f",
    "name": "Ana Souza",
    "email": "ana@email.com",
    "phone": "11999999999",
    "createdAt": "2026-06-08T20:28:08.222Z",
    "updatedAt": "2026-06-08T20:28:08.222Z"
  }
}
```

Se o e-mail ja existir:

```json
{
  "success": false,
  "message": "E-mail ja cadastrado",
  "error": {
    "code": 409
  }
}
```

### GET `/participants`

Lista participantes.

Campos de ordenacao permitidos:

- `createdAt`;
- `name`;
- `email`.

Exemplo:

```text
GET /participants?page=1&limit=20&search=gmail.com&sort=email&order=asc
```

### DELETE `/participants/:participantId`

Exclui participante por id.

A exclusao remove inscricoes relacionadas por causa do `onDelete: Cascade`.
Tambem invalida caches de participantes e eventos.

## Inscricoes em eventos

### POST `/events/:eventId/participants`

Inscreve um participante em um evento.

#### Request

```json
{
  "participantId": "0f7127e8-2de0-44ab-9c95-29ec3e14e53f"
}
```

#### Response `201`

```json
{
  "success": true,
  "message": "Participante inscrito no evento com sucesso",
  "data": {
    "eventId": "7ef3f7f9-cb01-4f62-8bc3-5a4f1c9d9f6a",
    "participantId": "0f7127e8-2de0-44ab-9c95-29ec3e14e53f",
    "createdAt": "2026-06-08T20:28:08.222Z"
  }
}
```

Possiveis erros:

- `404`: evento nao encontrado;
- `404`: participante nao encontrado;
- `409`: participante ja inscrito neste evento.

### GET `/events/:eventId/participants`

Lista participantes inscritos em um evento.

Campos de ordenacao permitidos:

- `createdAt`;
- `name`;
- `email`.

A busca textual procura em:

- nome;
- e-mail;
- telefone.

Exemplos:

```text
GET /events/:eventId/participants?page=1&limit=20
GET /events/:eventId/participants?search=ana&sort=name&order=asc
GET /events/:eventId/participants?search=@gmail.com&sort=email&order=asc
```

#### Response `200`

```json
{
  "success": true,
  "message": "Participantes do evento listados com sucesso",
  "data": {
    "data": [
      {
        "id": "0f7127e8-2de0-44ab-9c95-29ec3e14e53f",
        "name": "Ana Souza",
        "email": "ana@email.com",
        "phone": "11999999999",
        "createdAt": "2026-06-08T20:28:08.222Z",
        "updatedAt": "2026-06-08T20:28:08.222Z",
        "registeredAt": "2026-06-08T20:30:10.111Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

## Codigos de status principais

| Status | Uso                                   |
| -----: | ------------------------------------- |
|  `200` | Busca, listagem ou exclusao realizada |
|  `201` | Criacao realizada                     |
|  `400` | Body, query ou params invalidos       |
|  `401` | Token ausente ou invalido             |
|  `404` | Recurso inexistente                   |
|  `409` | E-mail ou inscricao duplicada         |
|  `429` | Rate limit excedido                   |
|  `500` | Erro interno inesperado               |
