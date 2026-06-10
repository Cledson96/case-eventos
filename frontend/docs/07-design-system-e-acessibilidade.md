# Design System e Acessibilidade

## Objetivo deste capitulo

Este capitulo documenta as decisoes visuais do frontend, a estrutura do design
system e os cuidados de acessibilidade aplicados na interface.

## Direcao visual

A direcao visual do frontend e "O Caderno de Producao": uma interface
operacional, limpa, organizada e densa o suficiente para trabalho real.

A base e tinta sobre papel:

- fundo branco;
- texto quase preto;
- bordas leves;
- ambar/mel como acento de marca;
- verde e vermelho apenas para feedback.

## Sem biblioteca de UI

O projeto nao usa Material UI, Bootstrap ou similares, atendendo o requisito do
case.

Os componentes sao proprios e ficam em:

```text
src/components/
  layout/
  providers/
  ui/
```

## Tokens globais

Os tokens principais ficam em `src/app/globals.css`:

- `--background`;
- `--foreground`;
- `--brand`;
- `--brand-hover`;
- `--brand-strong`;
- `--brand-contrast`;
- `--brand-soft`;
- `--border`.

Eles sao expostos ao Tailwind por `@theme inline`, permitindo usar classes como
`bg-brand`, `text-brand-strong` e `border-border`.

## Tipografia

`Typography` centraliza variantes de texto:

- `display`;
- `title`;
- `heading`;
- `section`;
- `subsection`;
- `card-title`;
- `lead`;
- `body`;
- `body-sm`;
- `body-muted`;
- `label`;
- `caption`;
- `error`.

Isso ajuda a manter hierarquia consistente entre telas.

## Componentes compartilhados

| Componente      | Papel                                   |
| --------------- | --------------------------------------- |
| `Header`        | Navegacao principal e tema              |
| `BrandMark`     | Marca grafica da aplicacao              |
| `PageContainer` | Largura e espacamento base              |
| `BackLink`      | Link de retorno contextual              |
| `DateTile`      | Identidade visual para datas de eventos |
| `TextField`     | Campo acessivel com erro                |
| `EmptyState`    | Estado vazio reutilizavel               |
| `Pagination`    | Navegacao paginada                      |
| `Toast`         | Feedback global                         |

## Tema claro e escuro

O tema escuro e controlado por classe `dark` no `documentElement`.

`ThemeToggle` alterna o tema e persiste a escolha em `localStorage`.

O script no layout aplica a preferencia antes do paint, evitando flash visual
entre tema claro e escuro.

## Acessibilidade aplicada

Cuidados implementados:

- labels associados aos campos;
- `aria-invalid` e `aria-describedby` em campos com erro;
- mensagens de erro com `role="alert"`;
- toasts com `role="status"` ou `role="alert"`;
- links e botoes com foco visivel;
- `aria-current` no link ativo do header;
- `aria-label` em botoes iconicos;
- `aria-label` especifico em paginacoes;
- SVGs decorativos com `aria-hidden`;
- suporte a `prefers-reduced-motion`.

## Contatos truncados

Na lista de participantes, e-mail e telefone podem ser longos.

Para evitar quebra visual:

- os valores usam ellipsis;
- e-mail e telefone ficam em linhas separadas;
- o valor completo aparece via tooltip/popover ao clicar;
- o `title` tambem preserva acesso rapido ao texto completo.

## Estados visuais

A aplicacao possui:

- loading skeleton em listagens e detalhes;
- empty states para listas vazias;
- error boundary com botao de tentar novamente;
- not found para rotas inexistentes;
- disabled state durante submits.

## Decisoes de densidade

Alguns botoes foram mantidos compactos para preservar a leitura operacional da
tela. Isso evita uma interface inflada e mantem o padrao visual escolhido para
o produto.
