# Performance e Resiliencia

## Objetivo deste capitulo

Este capitulo documenta as decisoes de performance e resiliencia do frontend:
paginacao, timeouts, componentes server-side, estados de erro e comportamento
com dados grandes.

## Server-side data fetching

As leituras principais acontecem em Server Components.

Beneficios:

- evita expor token ao browser;
- reduz chamadas duplicadas no client;
- permite renderizar HTML ja com dados;
- usa o cache e a infraestrutura HTTP do servidor Next.

## Paginacao

A aplicacao usa paginacao para evitar telas pesadas:

- `/events` carrega 12 eventos por pagina;
- `/events/:eventId` carrega 10 participantes por pagina.

Isso e importante porque o seed possui evento com 1000 participantes.

## Busca preservada

Na lista de participantes, a paginacao preserva `search`:

```text
?search=maria&page=2#participantes
```

Assim o usuario nao perde o filtro ao trocar de pagina.

## Timeout HTTP

`httpClient` usa timeout de 10 segundos no Axios:

```ts
timeout: 10000;
```

Isso evita que uma pagina fique esperando indefinidamente por uma API que nao
responde.

## Home resiliente

A home trata falha ao buscar proximos eventos:

```ts
try {
  upcoming = await eventsService.listUpcoming(3);
} catch {
  upcoming = [];
}
```

Assim a tela inicial continua acessivel mesmo quando a API esta temporariamente
indisponivel.

## Error boundaries

A rota de eventos possui `error.tsx` com botao de tentar novamente.

Isso cobre falhas de API durante carregamento server-side.

## Loading states

As rotas possuem skeletons de loading para evitar tela em branco durante a
navegacao:

- `src/app/events/loading.tsx`;
- `src/app/events/[eventId]/loading.tsx`.

## Formularios resilientes

`useForm` protege contra duplo submit usando ref interna alem do estado
`submitting`.

Isso evita duas requisicoes quando o usuario clica muito rapido no botao antes
do React aplicar o estado visual.

## Toasts

`ToastProvider` limpa timers no unmount. Isso evita callback pendente tentando
alterar estado depois que o provider nao existe mais.

## Texto longo

Campos com potencial de texto longo usam:

- `truncate`;
- `line-clamp`;
- `min-w-0` em containers flex;
- tooltip/popover para contato completo.

Essas escolhas evitam overflow em nomes, e-mails e telefones grandes.

## Responsividade

A interface foi validada em desktop e mobile com Browser interno:

- sem overflow horizontal nas telas principais;
- grid de eventos muda por breakpoint;
- detalhe do evento muda de duas colunas para uma coluna;
- formulario lateral deixa de ser sticky em telas menores.

## Limites conhecidos

Alguns controles permanecem visualmente compactos para preservar a densidade da
interface. Isso e uma escolha consciente de produto para uma ferramenta
operacional, mas pode ser revisto se o foco virar uso mobile intensivo.
