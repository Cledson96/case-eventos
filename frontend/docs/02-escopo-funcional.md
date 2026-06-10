# Escopo Funcional

## Objetivo deste capitulo

Este capitulo documenta o que o frontend entrega em termos de telas, fluxos,
comportamentos e limites. Ele tambem separa o que faz parte do case do que foi
mantido fora do escopo.

## Funcionalidades obrigatorias atendidas

O frontend atende os requisitos pedidos pelo case:

- pagina de listagem de eventos;
- pagina de detalhes de um evento com participantes;
- formulario para criacao de eventos;
- formulario para inscricao de participantes;
- consumo da API com Axios;
- TypeScript em toda a aplicacao;
- Next.js com React;
- sem bibliotecas de UI como Material UI ou Bootstrap.

## Funcionalidades complementares

Alem do minimo exigido, a interface inclui:

- pagina inicial com proximos eventos;
- paginacao na listagem de eventos;
- paginacao na listagem de participantes do evento;
- busca de participantes por nome, e-mail ou telefone;
- exclusao de participante pela tela do evento;
- previa ao vivo na criacao de evento;
- toasts de sucesso e erro;
- tema claro e escuro;
- estados de loading, erro, vazio e not found;
- protecao contra duplo submit em formularios;
- tooltip/popover simples para contato truncado.

## Rotas de tela

| Rota               | Finalidade                                              |
| ------------------ | ------------------------------------------------------- |
| `/`                | Pagina inicial com chamada principal e proximos eventos |
| `/events`          | Lista eventos em ordem de data, com paginacao           |
| `/events/new`      | Cadastra um novo evento                                 |
| `/events/:eventId` | Exibe detalhes do evento, participantes e inscricao     |

## Rotas internas BFF

As rotas em `src/app/api` existem para receber chamadas do browser e repassar
ao backend com `API_TOKEN` no lado servidor.

| Rota interna                        | Metodo | Uso na interface             |
| ----------------------------------- | ------ | ---------------------------- |
| `/api/events`                       | POST   | Criar evento                 |
| `/api/events/:eventId/participants` | POST   | Criar/inscrever participante |
| `/api/participants/:participantId`  | DELETE | Excluir participante         |

## Fluxo principal do usuario

1. O usuario acessa `/events`.
2. Visualiza os eventos cadastrados.
3. Cria um novo evento em `/events/new` quando necessario.
4. Abre o detalhe de um evento.
5. Busca participantes existentes por nome, e-mail ou telefone.
6. Inscreve um novo participante no evento.
7. Remove participantes quando necessario.

## Busca e paginacao

Na tela de detalhe, a busca de participantes usa query string:

```text
/events/:eventId?search=maria&page=2#participantes
```

A paginacao preserva filtros ativos e ancora a navegacao em
`#participantes`, evitando que o usuario perca contexto ao trocar de pagina.

## Exclusoes

O frontend permite excluir participante pela tela do evento. A acao usa
confirmacao inline antes de chamar a rota interna de DELETE.

## Fora do escopo

Nao fazem parte do frontend neste case:

- login de usuario;
- permissoes por perfil;
- dashboard administrativo;
- upload de imagem;
- calendario visual;
- filtros avancados de evento;
- edicao de eventos ou participantes;
- internacionalizacao completa.

Esses pontos foram evitados para manter o foco no que o desafio pede:
funcionalidade, organizacao e qualidade de implementacao.
