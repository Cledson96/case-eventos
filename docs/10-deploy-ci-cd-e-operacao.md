# Deploy, CI/CD e Operacao

## Objetivo deste capitulo

Este capitulo descreve o fluxo de CI/CD e deploy em VPS, incluindo GitHub
Actions, GHCR, Docker Compose, nginx e certbot.

## Workflows

O projeto possui dois workflows:

```text
.github/workflows/ci.yml
.github/workflows/deploy.yml
```

## CI

O CI valida backend e frontend em pushes e pull requests para `development` e
`main`.

O objetivo e impedir que codigo sem teste, lint, typecheck ou build valido
avance para deploy.

## Deploy

O deploy:

1. builda imagens Docker no GitHub Actions;
2. publica imagens no GHCR;
3. conecta na VPS por SSH;
4. prepara arquivos de deploy;
5. faz pull das imagens;
6. sobe containers via Docker Compose;
7. configura nginx;
8. emite/renova certificados com certbot quando necessario.

## Ambientes

Branch `development`:

- Environment GitHub: `development`;
- dominio de desenvolvimento;
- compose project name proprio;
- portas proprias.

Branch `main`:

- Environment GitHub: `production`;
- dominio de producao;
- compose project name proprio;
- portas proprias.

## Imagens

Formato das imagens:

```text
ghcr.io/cledson96/case-eventos-backend:<sha>
ghcr.io/cledson96/case-eventos-frontend:<sha>
```

## Arquivos de deploy

```text
deploy/
  docker-compose.vps.yml
  nginx/
    reverse-proxy-http.conf
    reverse-proxy-https.conf
scripts/
  deploy-docker.sh
```

## Secrets obrigatorios

```text
VPS_HOST
VPS_USER
VPS_SSH_KEY
API_TOKEN
POSTGRES_PASSWORD
```

## Secrets opcionais

```text
VPS_PORT
CERTBOT_EMAIL
DATABASE_URL
GHCR_PULL_TOKEN
```

## Vars obrigatorias

```text
FRONTEND_DOMAIN
BACKEND_DOMAIN
```

## Vars recomendadas

```text
DEPLOY_PATH=/opt/case-eventos-development
COMPOSE_PROJECT_NAME=case-eventos-development
FRONTEND_PORT=3001
BACKEND_PORT=3334
BASE_URL=https://api-eventos-dev.seudominio.com
FRONTEND_PUBLIC_URL=https://eventos-dev.seudominio.com
ALLOWED_ORIGINS=https://eventos-dev.seudominio.com
RUN_SEED_ON_DEPLOY=true
```

## Seed em deploy

`RUN_SEED_ON_DEPLOY=true` popula o ambiente com dados fake.

Essa opcao e util em ambiente de desenvolvimento/demo. Em producao real, o mais
seguro e deixar `false`, a menos que o objetivo seja demonstracao.

## nginx e certbot

nginx fica no host e publica os dominios do frontend e backend. Certbot tambem
roda no host.

Os containers nao precisam gerenciar TLS diretamente.

## Banco em VPS

No compose de VPS, o Postgres deve ficar dentro da rede Docker, sem exposicao
publica direta. O acesso externo ao banco nao e necessario para o uso da
aplicacao.

## Validacao pos-deploy

Depois do deploy:

1. abrir dominio do frontend;
2. abrir Swagger do backend;
3. validar `/health`;
4. criar evento;
5. inscrever participante;
6. verificar logs dos containers;
7. validar certificados HTTPS.

## Comandos uteis na VPS

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose pull
docker compose up -d
sudo nginx -t
sudo systemctl reload nginx
```
