# Troubleshooting e FAQ

## Objetivo deste capitulo

Este capitulo lista problemas comuns no frontend e caminhos de diagnostico.

## A pagina mostra erro ao carregar dados

Verifique se o backend esta no ar:

```bash
curl http://localhost:3333/health
```

Tambem confira `API_URL` no `.env.local`:

```env
API_URL=http://localhost:3333
```

## Recebo erro de token

Confira se `API_TOKEN` no frontend e igual ao token do backend:

```env
API_TOKEN=case-eventos-dev-token
```

O token e usado apenas no servidor Next. Ele nao deve ter prefixo
`NEXT_PUBLIC_`.

## `npm run build` falha por variavel ausente

O frontend exige `API_TOKEN` server-side.

Crie `.env.local` ou exporte a variavel antes do build:

```bash
API_TOKEN=case-eventos-dev-token npm run build
```

No Dockerfile, um token temporario e usado apenas para permitir build:

```dockerfile
API_TOKEN=case-eventos-build-token npm run build
```

## Formulario nao envia

Verifique se os campos obrigatorios estao preenchidos e se nao ha mensagem de
erro abaixo do campo.

Campos validados:

- nome;
- e-mail;
- telefone;
- data;
- descricao.

## Evento criado nao aparece

Verifique:

- se a API retornou sucesso;
- se o backend esta apontando para o banco correto;
- se a listagem esta em outra pagina;
- se a data do evento influencia a ordenacao.

## Participante nao aparece na busca

A busca usa nome, e-mail ou telefone.

Verifique:

- acentos e espacos;
- se esta no evento correto;
- se a inscricao foi concluida;
- se a paginacao esta preservando o filtro.

## Toast nao aparece

Confirme se o componente esta dentro de `ToastProvider`. O provider e
registrado no layout raiz.

## Tema nao persiste

O tema usa `localStorage`.

Se o navegador bloquear storage, o tema ainda alterna na sessao atual, mas pode
nao persistir apos recarregar.

## Erro de CORS

O browser nao chama o backend diretamente nos fluxos de escrita. Ele chama as
rotas internas `/api`.

Se aparecer erro de CORS, verifique:

- chamadas customizadas feitas fora dos services;
- `API_URL` incorreto;
- configuracao de CORS no backend para outros clientes.

## Docker sobe, mas a tela falha ao buscar dados

Dentro do container, `localhost` aponta para o proprio container, nao para o
host.

Em Docker Compose, use o nome do servico do backend quando aplicavel:

```env
API_URL=http://backend:3333
```

Em VPS, use o dominio interno/publico configurado para a API.

## Como limpar o ambiente local

Reinstalar dependencias:

```bash
Remove-Item -Recurse -Force node_modules
npm install
```

Limpar build do Next:

```bash
Remove-Item -Recurse -Force .next
npm run build
```
