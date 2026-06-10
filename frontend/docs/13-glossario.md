# Glossario

## Objetivo deste capitulo

Este capitulo define termos usados na documentacao e no codigo do frontend.

## App Router

Modelo de roteamento do Next.js usado em `src/app`.

## BFF

Backend for Frontend. No projeto, sao os Route Handlers em `src/app/api`, que
recebem chamadas do browser e repassam ao backend com token server-side.

## Client Component

Componente React que roda no browser e pode usar hooks como `useState`,
`useRouter` e `useSyncExternalStore`.

## Context API

API do React usada para compartilhar estado entre componentes. No projeto, e
usada para toasts.

## Empty state

Estado exibido quando nao ha dados para mostrar, como lista vazia de eventos ou
participantes.

## Event

Tipo que representa um evento cadastrado.

## EventParticipant

Tipo que representa um participante inscrito em um evento, incluindo
`registeredAt`.

## Hook

Funcao React que encapsula estado e comportamento reutilizavel. Exemplo:
`useForm`.

## Hydration

Processo em que o React ativa no browser o HTML renderizado pelo servidor.

## Layout

Arquivo ou componente que envolve paginas e componentes compartilhados, como
header e provider de toast.

## Loading state

Estado visual exibido enquanto uma rota ou dado esta carregando.

## Pagination

Componente e padrao de navegacao por paginas. Usa `page`, `totalPages` e links
anterior/proxima.

## Participant

Tipo que representa uma pessoa cadastrada para participar de eventos.

## Route Handler

Funcao do Next.js em `src/app/api` que responde a uma requisicao HTTP.

## Server Component

Componente React renderizado no servidor. No projeto, e usado para buscar dados
sem expor `API_TOKEN`.

## Service

Camada em `src/services` responsavel por chamar endpoints do backend.

## Tailwind CSS

Framework utilitario usado para estilizar componentes sem biblioteca de UI.

## Toast

Notificacao temporaria usada para informar sucesso ou erro de uma acao.

## Tooltip

Elemento pequeno usado para revelar informacao completa quando um texto esta
truncado.

## Typecheck

Validacao do TypeScript sem gerar arquivos de build.
