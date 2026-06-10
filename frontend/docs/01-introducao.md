# Introducao

## Objetivo deste capitulo

Este capitulo apresenta o frontend do Case Eventos em nivel executivo e
tecnico. A ideia e deixar claro qual problema a interface resolve, quais
requisitos do case ela atende e quais escolhas foram feitas para entregar uma
aplicacao funcional, navegavel e avaliavel.

Esta documentacao cobre apenas o frontend. A documentacao do backend e a
documentacao geral do projeto ficam em materiais separados, para que cada
parte possa ser lida sem misturar responsabilidades.

## Contexto do case

O desafio pede uma aplicacao fullstack simples para gerenciar eventos e
participantes. No frontend, o requisito central e entregar uma interface em
React, TypeScript e Next.js capaz de:

- listar eventos;
- exibir detalhes de um evento;
- listar participantes inscritos;
- criar eventos;
- inscrever participantes em eventos.

A avaliacao valoriza organizacao, clareza, tipagem, separacao de
responsabilidades, navegabilidade e uma aplicacao funcional. Por isso, o
frontend foi construido com App Router, Server Components, Route Handlers como
BFF, servicos tipados, formularios controlados, estados de loading, erro e
vazio, alem de testes automatizados para os fluxos principais.

## O que foi entregue

O frontend entrega as telas exigidas pelo case e alguns complementos tecnicos
que ajudam a demonstrar maturidade de produto:

- pagina inicial com orientacao e proximos eventos;
- pagina de listagem de eventos com paginacao;
- pagina de criacao de evento com previa ao vivo;
- pagina de detalhes do evento com participantes paginados;
- busca de participantes por nome, e-mail ou telefone;
- formulario de inscricao de participante;
- exclusao de participante pela tela do evento;
- tema claro e escuro com persistencia local;
- toast de feedback para sucesso e erro;
- estados de loading, erro, vazio e not found;
- cliente HTTP server-side com token protegido;
- Route Handlers internos para submissoes do browser;
- validacoes client-side reutilizaveis;
- testes com Vitest e Testing Library;
- Dockerfile proprio para producao.

## Principios da implementacao

A implementacao foi guiada por quatro principios:

- **clareza para avaliacao**: rotas, componentes e servicos usam nomes
  explicitos;
- **seguranca do token**: `API_TOKEN` nunca e exposto ao browser;
- **interface operacional**: a tela prioriza leitura, busca, cadastro e acao
  rapida;
- **resiliencia**: ha tratamento para loading, erro, dados vazios, submit
  duplicado e listas maiores.

## Mapa da documentacao

| Capitulo                               | Assunto                                      |
| -------------------------------------- | -------------------------------------------- |
| `02-escopo-funcional.md`               | Funcionalidades, telas e limites do frontend |
| `03-stack-e-decisoes.md`               | Stack usada e motivacao tecnica              |
| `04-arquitetura.md`                    | Rotas, componentes, BFF e fluxo de dados     |
| `05-rotas-contratos-e-fluxos.md`       | Contratos entre tela, BFF e backend          |
| `06-estado-formularios-e-validacao.md` | Estado local, formularios e validacao        |
| `07-design-system-e-acessibilidade.md` | Design system, tema e acessibilidade         |
| `08-como-rodar.md`                     | Execucao local e com Docker                  |
| `09-deploy-operacao.md`                | Docker, VPS, health check e operacao         |
| `10-testes-validacao.md`               | Suite automatizada e validacao manual        |
| `11-performance-e-resiliencia.md`      | Paginacao, BFF, timeouts e robustez          |
| `12-troubleshooting-faq.md`            | Problemas comuns e diagnostico               |
| `13-glossario.md`                      | Termos usados no frontend                    |

## Resumo da proposta tecnica

O frontend nao tenta substituir o backend nem duplicar suas regras de dominio.
A proposta e entregar uma camada de apresentacao clara, com dados buscados de
forma segura no servidor do Next.js e interacoes client-side apenas onde elas
realmente agregam valor.

Essa combinacao permite que o avaliador rode o projeto, navegue pelo fluxo
principal, inspecione a arquitetura e entenda rapidamente como as telas se
conectam a API.
