# Deploy e Operacao

## Objetivo deste capitulo

Este capitulo descreve como o frontend e preparado para producao, como a
imagem Docker funciona e quais pontos devem ser observados em deploy na VPS.

## Modelo de deploy

O frontend participa do fluxo geral do projeto:

1. GitHub Actions valida e builda a aplicacao.
2. A imagem Docker e publicada no GHCR.
3. A VPS baixa a imagem.
4. Docker Compose inicia o container.
5. nginx expoe o dominio publico.
6. certbot gerencia TLS sem acoplar certificado ao container.

## Dockerfile

O Dockerfile usa dois estagios:

- `build`: instala dependencias e executa `npm run build`;
- `runner`: copia o standalone build do Next e roda `node server.js`.

O container roda com usuario nao-root `nextjs`.

## Build standalone

O frontend usa build standalone do Next para reduzir o runtime necessario no
container.

Arquivos copiados para a imagem final:

```text
/app/public
/app/.next/standalone
/app/.next/static
```

## Variaveis em build

Durante o build da imagem, o Dockerfile recebe:

```dockerfile
ARG API_URL=http://localhost:3333
ENV API_URL=$API_URL
```

Tambem usa um token temporario apenas para permitir build:

```dockerfile
RUN API_TOKEN=case-eventos-build-token npm run build
```

O token real deve ser configurado em runtime.

## Variaveis em runtime

Variaveis esperadas no ambiente de producao:

```env
API_URL=https://api-case-eventos.seu-dominio.com
API_TOKEN=<token-real-do-backend>
```

Essas variaveis sao usadas server-side e nao devem ser expostas como
`NEXT_PUBLIC_*`.

## Porta

O container expoe a porta:

```text
3000
```

Em producao, essa porta deve ficar atras do nginx. Nao e necessario expor a
porta diretamente para internet.

## Health check

O Dockerfile possui health check:

```dockerfile
HEALTHCHECK CMD node -e "fetch('http://127.0.0.1:3000')..."
```

Esse check valida se o servidor Next responde dentro do container.

## nginx

nginx deve apontar o dominio do frontend para o container do frontend.

O frontend chama o backend pelo `API_URL` no servidor Next, nao pelo browser.
Por isso, o dominio publico da API precisa estar acessivel pela VPS/container.

## Certbot

Certbot deve gerenciar certificados no nivel do host/nginx. O container do
frontend nao precisa conhecer certificados TLS.

## Operacao basica

Comandos uteis na VPS:

```bash
docker compose ps
docker compose logs -f frontend
docker compose pull frontend
docker compose up -d frontend
```

## Riscos operacionais

Pontos que merecem atencao:

- `API_TOKEN` incorreto causa erro nas paginas que buscam dados;
- `API_URL` apontando para URL inacessivel causa falha de carregamento;
- backend fora do ar impacta listagens e detalhes;
- build sem `API_TOKEN` falha porque a configuracao exige token server-side;
- cache do navegador pode manter tema antigo, mas isso nao afeta dados.

## Validacao pos-deploy

Depois do deploy:

1. abrir dominio do frontend;
2. validar `/events`;
3. criar evento;
4. abrir detalhe;
5. inscrever participante;
6. conferir logs do container;
7. validar que o token nao aparece no bundle ou no navegador.
