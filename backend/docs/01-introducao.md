# Introducao

## Objetivo deste capitulo

Este capitulo apresenta o backend do Case Eventos em nivel executivo e
tecnico. A ideia e deixar claro qual problema a API resolve, quais requisitos
do case ela atende e quais escolhas foram feitas para transformar um desafio
simples em uma entrega funcional, navegavel e avaliavel.

Esta documentacao cobre apenas o backend. A documentacao geral do projeto e a
documentacao do frontend devem ficar em materiais separados, para que cada
parte possa ser lida sem misturar responsabilidades.

## Contexto do case

O desafio pede uma aplicacao fullstack simples para gerenciar eventos e
participantes. No backend, o requisito central e expor uma API REST em Node.js,
TypeScript e PostgreSQL capaz de:

- cadastrar eventos;
- cadastrar participantes;
- inscrever participantes em eventos;
- listar participantes de um evento.

A avaliacao valoriza mais organizacao, clareza, tipagem, separacao de
responsabilidades, migrations e boas praticas do que volume de funcionalidades.

Por isso, o backend foi construido com uma estrutura modular e previsivel,
usando camadas explicitas, validacao com Zod, Prisma para acesso ao banco,
Swagger para documentacao interativa, Redis opcional para cache e uma suite de
testes cobrindo regras de negocio, HTTP, persistencia, cache e scripts de apoio.

## O que foi entregue

O backend entrega a API exigida pelo case e alguns complementos tecnicos que
ajudam a demonstrar maturidade de projeto:

- Express com TypeScript strict;
- Prisma com PostgreSQL e migrations versionadas;
- modulos `events` e `participants`;
- paginacao, busca textual e ordenacao segura nas listagens;
- inscricao de participantes em eventos com protecao contra duplicidade;
- exclusao de eventos e participantes;
- Redis cache opcional para listagens e detalhe de evento;
- Swagger UI em `/docs` e OpenAPI JSON em `/docs.json`;
- Bearer token simples para proteger rotas de dominio;
- middlewares de seguranca, CORS, rate limit e body limit;
- logs estruturados com Pino e request id;
- health checks em `/health`, `/livez` e `/readyz`;
- seed com dados fake e um evento com 1000 participantes;
- testes automatizados com Vitest e Supertest;
- scripts de performance para carga controlada;
- Dockerfile, Docker Compose local e fluxo de deploy para VPS.

## Principios da implementacao

A implementacao foi guiada por quatro principios:

- **clareza para avaliacao**: nomes, pastas e fluxos foram mantidos explicitos;
- **separacao de responsabilidades**: cada camada tem um papel bem definido;
- **funcionalidade real**: a API sobe, persiste dados, documenta contratos e
  pode ser testada localmente ou em Docker;
- **evolucao segura**: testes, migrations e contratos reduzem risco de
  regressao.

## Mapa da documentacao

| Capitulo                            | Assunto                                     |
| ----------------------------------- | ------------------------------------------- |
| `02-escopo-funcional.md`            | Funcionalidades, rotas e limites do backend |
| `03-stack-e-decisoes.md`            | Stack usada e motivacao tecnica             |
| `04-arquitetura.md`                 | Camadas, modulos e fluxo de uma request     |
| `05-api-contratos-e-exemplos.md`    | Contratos HTTP e exemplos praticos          |
| `06-dados-cache-e-prisma.md`        | Banco, migrations, indices, seed e cache    |
| `07-seguranca-erros-e-validacao.md` | Auth, validacao, erros e middlewares        |
| `08-como-rodar.md`                  | Execucao local e com Docker                 |
| `09-deploy-operacao.md`             | Deploy, VPS, health checks e operacao       |
| `10-testes-validacao.md`            | Suite automatizada e validacao manual       |
| `11-seed-performance-e-carga.md`    | Massa de teste e scripts de performance     |
| `12-troubleshooting-faq.md`         | Problemas comuns e diagnostico              |
| `13-glossario.md`                   | Termos usados no projeto                    |

## Resumo da proposta tecnica

O backend nao tenta resolver problemas fora do escopo do case, como login de
usuarios, permissoes por perfil, notificacoes ou pagamento. A proposta e
entregar uma API pequena, mas com padrao profissional: contratos claros,
persistencia correta, testes, documentacao e deploy.

Essa combinacao permite que o avaliador rode o projeto, navegue pelo Swagger,
inspecione a arquitetura e entenda rapidamente onde cada responsabilidade esta
implementada.
