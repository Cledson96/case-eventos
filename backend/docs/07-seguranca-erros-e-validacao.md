# Seguranca, Erros e Validacao

## Objetivo deste capitulo

Este capitulo descreve os controles de seguranca, validacao de entrada,
tratamento de erros e padronizacao de responses do backend.

## Autenticacao

As rotas de dominio sao protegidas por Bearer token.

O token esperado vem da variavel:

```text
API_TOKEN
```

Exemplo de header:

```text
Authorization: Bearer case-eventos-dev-token
```

O middleware de autenticacao e aplicado antes de `/events` e `/participants`.
Rotas de health check e documentacao ficam publicas para facilitar operacao,
monitoramento e avaliacao.

## Comparacao segura do token

O middleware usa buffers para comparar o token recebido com o token esperado.
Isso evita comparacoes ingenuas de string e centraliza o comportamento de
autenticacao.

## Middlewares de seguranca

O servidor registra:

- `helmet`, para headers de seguranca HTTP;
- `cors`, com allowlist via env;
- `express-rate-limit`, para limitar abuso por IP;
- limite de body via `BODY_LIMIT`;
- desativacao de `x-powered-by`;
- `trust proxy` habilitado para funcionar atras de nginx.

## CORS

As origens permitidas vem de:

```text
ALLOWED_ORIGINS
```

O valor aceita lista separada por virgula:

```text
ALLOWED_ORIGINS=http://localhost:3000,https://case-eventos-dev.cledson.com.br
```

## Rate limit

Configuracoes:

```text
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=1000
```

Quando o limite e excedido, a API responde `429`.

## Validacao HTTP

A validacao de body, query e params acontece em middleware por rota:

```text
src/shared/middlewares/validateRequest
```

Os schemas ficam nos modulos:

```text
src/modules/events/schemas
src/modules/participants/schemas
```

O controller recebe dados ja validados em:

```text
response.locals.validatedRequest
```

Essa decisao reduz duplicacao e mantem os controllers focados em orquestrar a
resposta HTTP.

## Validacao de ambiente

As variaveis de ambiente sao validadas com Zod em:

```text
src/shared/config/env
```

Variaveis obrigatorias:

- `API_TOKEN`;
- `DATABASE_URL`.

Variaveis com padrao:

- `NODE_ENV`;
- `PORT`;
- `HOST`;
- `ALLOWED_ORIGINS`;
- `RATE_LIMIT_WINDOW_MS`;
- `RATE_LIMIT_MAX`;
- `BODY_LIMIT`;
- `LOG_LEVEL`;
- `CACHE_TTL_SECONDS`.

Variaveis opcionais:

- `BASE_URL`;
- `REDIS_URL`.

## Response helpers

O middleware `responseFormatter` adiciona helpers padronizados ao response:

- `response.success`;
- `response.created`;
- `response.error`.

Isso garante consistencia entre modulos.

## Erros customizados

A pasta `src/shared/errors` contem erros HTTP reutilizaveis:

- `BadRequestError`;
- `UnauthorizedError`;
- `ForbiddenError`;
- `NotFoundError`;
- `ConflictError`;
- `HttpError`.

Os services lancam esses erros quando uma regra de negocio falha.

## Error handler global

O `errorHandler` centraliza a conversao de erros para response HTTP.

Ele trata:

- erros HTTP customizados;
- erros conhecidos do Prisma;
- erros inesperados.

Em producao, detalhes internos sao omitidos. Em desenvolvimento e teste, a API
pode retornar mais detalhes para diagnostico.

## Exemplos de erros

### Validacao

```json
{
  "success": false,
  "message": "Dados da requisicao invalidos",
  "error": {
    "code": 400,
    "details": {
      "fieldErrors": {
        "name": ["Nome e obrigatorio"]
      }
    }
  }
}
```

### Nao autenticado

```json
{
  "success": false,
  "message": "Token de acesso nao informado",
  "error": {
    "code": 401
  }
}
```

### Conflito

```json
{
  "success": false,
  "message": "E-mail ja cadastrado",
  "error": {
    "code": 409
  }
}
```

## Request id

O middleware `requestContext` usa `X-Request-Id` quando informado ou gera um
novo identificador para a request.

Esse id aparece nos logs e ajuda a correlacionar erro, request e resposta.

## Swagger e seguranca

O Swagger documenta o esquema Bearer token e marca as rotas protegidas com
erro `401`. Assim o avaliador consegue testar as rotas protegidas diretamente
pela UI usando o botao `Authorize`.
