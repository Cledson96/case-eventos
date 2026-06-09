# Troubleshooting e FAQ

## Objetivo deste capitulo

Este capitulo lista problemas comuns ao rodar, testar ou publicar o backend e
mostra caminhos de diagnostico rapido.

## A API responde 401 nas rotas de eventos e participantes

As rotas de dominio exigem Bearer token.

Confira o header:

```text
Authorization: Bearer case-eventos-dev-token
```

E confira se o valor bate com:

```text
API_TOKEN
```

Health checks e Swagger nao exigem token.

## O Swagger abre, mas nao mostra endpoints

Verifique `/docs.json`.

Se `paths` vier vazio, o problema costuma estar na geracao dos blocos
`@swagger` no build.

Valide:

```bash
npm run build
node -e "import('./dist/shared/config/swagger/index.js').then(({getSwaggerSpec})=>console.log(Object.keys(getSwaggerSpec().paths)))"
```

O resultado esperado deve incluir:

- `/events`;
- `/events/{eventId}`;
- `/events/{eventId}/participants`;
- `/participants`;
- `/participants/{participantId}`.

## O Swagger mostra localhost em producao

Configure:

```text
BASE_URL=https://api.seudominio.com
```

No deploy da VPS, se `BASE_URL` nao for configurado, o workflow usa
`https://${BACKEND_DOMAIN}`.

## Erro de BASE_URL nos testes

O `BASE_URL` precisa ser URL absoluta, como:

```text
http://localhost:3333
```

O Vitest normal e o Vitest de banco configuram esse valor explicitamente para
evitar que algum default interno seja usado como `/`.

## Redis indisponivel

Se o Redis estiver fora, a API deve seguir funcionando sem cache.

Mensagem esperada nos logs:

```text
Cache Redis indisponivel, seguindo sem cache
```

Confira:

```bash
docker compose ps redis
docker compose logs redis
```

## Banco indisponivel

Se `/readyz` responder `503`, confira PostgreSQL:

```bash
docker compose ps postgres
docker compose logs postgres
```

Tambem valide:

```text
DATABASE_URL
```

## Migrations nao aplicam

Em desenvolvimento:

```bash
npm run db:migrate
```

Em Docker/producao:

```bash
npm run db:deploy
```

Se o erro ocorrer no CI, verifique se o banco de teste foi criado e se
`DATABASE_TEST_URL` aponta para o banco correto.

## Prisma Client nao encontrado

Rode:

```bash
npm run db:generate
```

No Dockerfile, o build ja roda `npm run db:generate` antes da compilacao.

## Porta 3333 ocupada

Verifique processos locais ou altere:

```text
PORT=3334
```

Se estiver usando Docker Compose local, ajuste tambem o mapeamento de portas.

## CORS bloqueando frontend

Adicione a origem do frontend em:

```text
ALLOWED_ORIGINS
```

Exemplo:

```text
ALLOWED_ORIGINS=http://localhost:3000,https://case-eventos-dev.cledson.com.br
```

## E-mail duplicado retorna 409

Isso e esperado quando o participante ja existe.

O e-mail e normalizado para lowercase, entao estes dois valores representam o
mesmo cadastro:

```text
ANA@EMAIL.COM
ana@email.com
```

## Participante ja inscrito retorna 409

Isso e esperado quando a relacao `eventId + participantId` ja existe.

A protecao acontece na camada de servico e tambem no banco por chave composta.

## Busca de participantes do evento nao encontra resultado

Confira se o participante esta inscrito naquele evento especifico.

O endpoint:

```text
GET /events/:eventId/participants?search=ana
```

busca apenas entre participantes inscritos no evento informado.

A busca considera:

- nome;
- e-mail;
- telefone.

## Deploy passa, mas dominio nao abre

Verifique:

- DNS apontando para a VPS;
- porta `80` liberada para certbot;
- nginx ativo;
- certificados emitidos;
- containers saudaveis.

Comandos uteis na VPS:

```bash
sudo nginx -t
sudo systemctl status nginx
docker compose ps
docker compose logs backend
```

## Verificar logs do backend

Local:

```bash
docker compose logs -f backend
```

Na VPS, entre em `DEPLOY_PATH` e rode:

```bash
docker compose logs -f backend
```

## Validacao final rapida

```bash
curl http://localhost:3333/health
curl http://localhost:3333/docs.json
curl http://localhost:3333/events -H "Authorization: Bearer case-eventos-dev-token"
```
