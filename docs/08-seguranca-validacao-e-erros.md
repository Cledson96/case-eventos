# Seguranca, Validacao e Erros

## Objetivo deste capitulo

Este capitulo resume as decisoes de seguranca, validacao e tratamento de erros
no projeto completo.

## Autenticacao da API

As rotas de dominio do backend usam Bearer token simples:

```text
Authorization: Bearer <API_TOKEN>
```

Esse modelo atende o case sem introduzir login, sessao ou complexidade de
permissoes.

## Token no frontend

O frontend nunca expoe `API_TOKEN` ao browser.

O token e usado apenas:

- em Server Components;
- em Route Handlers;
- no `httpClient` server-side.

Variaveis publicas `NEXT_PUBLIC_*` nao sao usadas para token.

## Middlewares de seguranca

O backend usa:

- Helmet;
- CORS com allowlist;
- rate limit;
- body limit;
- request id.

## Validacao no backend

Zod valida:

- body;
- params;
- query params;
- envs.

A validacao ocorre em middleware de rota, antes do controller.

## Validacao no frontend

O frontend valida formularios para feedback imediato:

- campos obrigatorios;
- e-mail;
- telefone;
- nome;
- data;
- descricao.

Essa validacao melhora experiencia, mas o backend continua sendo a fonte final
de validacao.

## Erros padronizados na API

O backend responde erros no formato:

```json
{
  "success": false,
  "message": "Mensagem do erro",
  "error": {
    "code": 400,
    "details": {}
  },
  "timestamp": "2026-06-09T12:00:00.000Z"
}
```

Status principais:

- `400`: validacao;
- `401`: token ausente ou invalido;
- `404`: recurso inexistente;
- `409`: conflito, como e-mail ou inscricao duplicada;
- `500`: erro interno.

## Tratamento de erros Prisma

Erros conhecidos do Prisma sao mapeados para erros HTTP adequados. Isso evita
vazar detalhes internos do banco e melhora a previsibilidade da API.

## Tratamento de erros no frontend

O frontend usa:

- `extractErrorMessage`;
- `extractErrorStatus`;
- toasts;
- `error.tsx`;
- `not-found.tsx`.

Com isso, erros de formulario aparecem como feedback direto e erros de
carregamento aparecem em estados de rota.

## Rate limit e performance

O rate limit protege a API em uso normal. Para testes de performance, e
possivel ajustar `RATE_LIMIT_MAX` no ambiente.

## CORS

Em desenvolvimento, a allowlist inclui o frontend local.

Em deploy, `ALLOWED_ORIGINS` deve apontar para o dominio real do frontend.

## Fora do escopo de seguranca

Nao foram implementados:

- login de usuario;
- refresh token;
- RBAC;
- OAuth;
- auditoria de usuario final.

Esses itens foram deixados fora porque o teste nao pede autenticacao de
usuarios.
