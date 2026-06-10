# Escopo Funcional

## Objetivo deste capitulo

Este capitulo descreve o que o backend faz do ponto de vista funcional. O foco
e separar claramente o que esta dentro do escopo, quais endpoints existem,
quais regras de negocio foram implementadas e quais pontos ficaram fora por
decisao de produto.

## Funcionalidades obrigatorias do case

O backend cobre as quatro funcionalidades obrigatorias:

| Funcionalidade                    | Endpoint principal                   | Status       |
| --------------------------------- | ------------------------------------ | ------------ |
| Cadastrar evento                  | `POST /events`                       | Implementado |
| Cadastrar participante            | `POST /participants`                 | Implementado |
| Inscrever participante em evento  | `POST /events/:eventId/participants` | Implementado |
| Listar participantes de um evento | `GET /events/:eventId/participants`  | Implementado |

Essas rotas estao protegidas por Bearer token, validam entrada com Zod e
retornam respostas padronizadas.

## Funcionalidades complementares

Foram adicionadas funcionalidades pequenas que tornam a API mais completa para
uso real e avaliacao:

- listagem paginada de eventos;
- busca de evento por id;
- exclusao de evento;
- listagem paginada de participantes;
- exclusao de participante;
- busca textual em listagens;
- ordenacao segura por campos permitidos;
- cache Redis opcional para leituras;
- seed com massa realista de teste;
- scripts de performance para listar participantes de um evento grande.

## Mapa funcional das rotas

| Metodo   | Rota                            | Finalidade                              |
| -------- | ------------------------------- | --------------------------------------- |
| `GET`    | `/health`                       | Healthcheck geral da API                |
| `GET`    | `/livez`                        | Sinal simples de processo vivo          |
| `GET`    | `/readyz`                       | Sinal de prontidao com banco disponivel |
| `GET`    | `/docs`                         | Swagger UI                              |
| `GET`    | `/docs.json`                    | Especificacao OpenAPI                   |
| `POST`   | `/events`                       | Cria evento                             |
| `GET`    | `/events`                       | Lista eventos com paginacao             |
| `GET`    | `/events/:eventId`              | Busca evento por id                     |
| `DELETE` | `/events/:eventId`              | Exclui evento                           |
| `POST`   | `/participants`                 | Cria participante                       |
| `GET`    | `/participants`                 | Lista participantes com paginacao       |
| `DELETE` | `/participants/:participantId`  | Exclui participante                     |
| `POST`   | `/events/:eventId/participants` | Inscreve participante em evento         |
| `GET`    | `/events/:eventId/participants` | Lista participantes de um evento        |

## Regras de negocio

### Eventos

Um evento possui:

- `name`;
- `description`;
- `date`;
- datas de criacao e atualizacao gerenciadas pelo banco.

O backend valida nome, descricao e data antes de chamar a camada de servico.
Eventos podem ser listados com paginacao, busca por nome ou descricao e
ordenacao por `createdAt`, `date` ou `name`.

### Participantes

Um participante possui:

- `name`;
- `email`;
- `phone`;
- datas de criacao e atualizacao gerenciadas pelo banco.

O e-mail e normalizado para lowercase antes da persistencia. O banco possui
restricao unica para e-mail, e a camada de servico tambem verifica duplicidade
para retornar uma mensagem de erro clara.

Participantes podem ser listados com paginacao, busca por nome, e-mail ou
telefone e ordenacao por `createdAt`, `name` ou `email`.

### Inscricao em evento

Uma inscricao relaciona um `eventId` com um `participantId`.

Antes de criar a inscricao, o servico verifica:

- se o evento existe;
- se o participante existe;
- se o participante ja esta inscrito naquele evento.

Caso a inscricao ja exista, a API responde `409`. Caso evento ou participante
nao exista, a API responde `404`.

## Paginacao, busca e ordenacao

As listagens usam uma convencao unica:

- `page`: pagina atual, iniciando em `1`;
- `limit`: quantidade por pagina, com maximo `100`;
- `search`: busca textual opcional;
- `sort`: campo permitido para ordenacao;
- `order`: `asc` ou `desc`.

O formato de retorno paginado e:

```json
{
  "data": {
    "data": [],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

## Fora de escopo

Algumas funcionalidades nao foram implementadas porque o case nao exigia:

- cadastro de usuarios;
- login com senha;
- permissoes por perfil;
- upload de arquivos;
- notificacoes;
- check-in de participantes;
- cancelamento formal de inscricao sem excluir participante;
- auditoria detalhada de alteracoes;
- multi-tenant.

Esses pontos podem ser evoluidos depois sem quebrar a estrutura atual, porque
os modulos ja estao separados por dominio e as regras estao concentradas nas
camadas de servico.
