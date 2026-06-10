# Introducao e Contexto

## Objetivo deste capitulo

Este capitulo apresenta o projeto Case Eventos como entrega fullstack para o
teste tecnico. A ideia e contextualizar o problema, a empresa, o escopo da
solucao e como a documentacao geral se conecta aos materiais especificos de
backend e frontend.

## Contexto do desafio

O teste pede uma aplicacao fullstack simples para gerenciar eventos e
participantes. A proposta nao e medir volume de funcionalidades, mas avaliar:

- familiaridade com a stack;
- organizacao de codigo;
- clareza de implementacao;
- uso correto de TypeScript;
- separacao de responsabilidades;
- migrations;
- versionamento com Git;
- frontend funcional e navegavel.

Por isso, a entrega foi planejada como uma aplicacao pequena, mas completa:
API REST, banco relacional, cache opcional, frontend navegavel, Docker, CI/CD,
testes e documentacao.

## Contexto da HUMU

A HUMU se posiciona como uma estrutura para organizar operacoes financeiras
fragmentadas. A proposta da empresa fala sobre integrar pagamentos, conta
digital, credito, infraestrutura financeira, gestao de ativos e energia dentro
de uma arquitetura unica.

Mesmo sendo um case de eventos, a entrega foi construida com esse mesmo
criterio de organizacao:

- componentes separados por responsabilidade;
- backend e frontend independentes, mas integrados;
- contratos claros entre camadas;
- infraestrutura reproduzivel;
- deploy com ambientes;
- documentacao para operacao e avaliacao.

A frase "quatro frentes, uma arquitetura" serviu como referencia de leitura:
o projeto tambem separa frentes diferentes, mas mantem uma arquitetura coesa.

## Proposta da solucao

O Case Eventos permite:

- criar eventos;
- criar participantes;
- inscrever participantes em eventos;
- listar participantes de um evento;
- buscar e paginar dados;
- navegar por uma interface web;
- consultar contratos da API via Swagger.

O projeto foi organizado como monorepo:

```text
case-eventos/
  backend/
  frontend/
  deploy/
  scripts/
  docs/
```

## O que esta documentacao cobre

Esta documentacao geral cobre a visao fullstack:

- aderencia ao teste;
- arquitetura completa;
- relacao entre backend, frontend, banco, cache e deploy;
- comandos de execucao;
- CI/CD;
- qualidade, testes e performance;
- decisoes tecnicas e tradeoffs.

Documentacoes especificas:

- `backend/docs`: detalhes internos da API;
- `frontend/docs`: detalhes internos da interface;
- `README.md`: instrucoes resumidas de setup e entrega.

## Leitura recomendada para avaliacao

Para uma avaliacao rapida:

1. Leia `02-aderencia-ao-desafio.md`.
2. Leia `04-arquitetura-fullstack.md`.
3. Rode o projeto seguindo `09-execucao-local-e-docker.md`.
4. Consulte `11-testes-qualidade-e-performance.md`.
5. Abra `backend/docs` e `frontend/docs` para aprofundar.

## Resultado esperado

Ao final da leitura, o avaliador deve conseguir responder:

- quais requisitos do teste foram atendidos;
- como o projeto foi organizado;
- como rodar localmente;
- como validar a entrega;
- onde cada responsabilidade esta implementada;
- quais escolhas demonstram maturidade tecnica.
