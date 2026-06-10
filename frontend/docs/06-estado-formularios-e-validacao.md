# Estado, Formularios e Validacao

## Objetivo deste capitulo

Este capitulo explica como o frontend trata estado local, formularios,
validacao, mascaras, submits e feedback visual.

## Filosofia de estado

O frontend evita estado global desnecessario.

Os dados principais de eventos e participantes sao carregados em Server
Components. Estados client-side ficam restritos a interacoes locais:

- campos de formulario;
- erros de validacao;
- loading de submit;
- confirmacao de exclusao;
- toast;
- tema claro/escuro.

## Context API

Context API e usada apenas em `ToastProvider`.

Isso foi suficiente porque nao ha necessidade de compartilhar eventos ou
participantes entre muitas telas. O estado de dados vem do servidor e e
atualizado com `router.refresh()`.

## Hook `useForm`

`src/hooks/useForm.ts` centraliza o comportamento dos formularios:

- valores controlados;
- validadores por campo;
- transformacoes, como mascara de telefone;
- erros por campo;
- estado `submitting`;
- reset apos sucesso;
- protecao contra duplo submit.

## Validacoes

As validacoes ficam em `src/utils/validation.ts`.

Elas cobrem:

- nome obrigatorio;
- e-mail obrigatorio e formato valido;
- telefone obrigatorio;
- nome e descricao de evento;
- data do evento.

As mensagens aparecem proximas ao campo usando `TextField`.

## TextField

`TextField` concentra:

- label associado por `htmlFor`;
- input ou textarea;
- `aria-invalid`;
- `aria-describedby`;
- mensagem de erro com `role="alert"`;
- classes de foco e erro.

Isso evita repetir markup acessivel em cada formulario.

## Mascara de telefone

`maskPhone` formata o telefone enquanto o usuario digita.

O objetivo e melhorar legibilidade no formulario sem transferir regra de
persistencia para o frontend. O backend continua responsavel por validar o
payload recebido.

## Criacao de evento

`CreateEventForm` controla:

- `name`;
- `description`;
- `date`.

Ao enviar com sucesso:

1. chama `POST /api/events`;
2. exibe toast de sucesso;
3. atualiza a rota;
4. redireciona para o detalhe do evento criado.

## Inscricao de participante

`SubscribeParticipantForm` controla:

- `name`;
- `email`;
- `phone`.

Ao enviar com sucesso:

1. chama `POST /api/events/:eventId/participants`;
2. exibe toast de sucesso;
3. limpa o formulario;
4. chama `router.refresh()`.

## Exclusao de participante

`DeleteParticipantAction` usa confirmacao inline:

1. clique em `Excluir`;
2. interface mostra `Confirmar` e `Cancelar`;
3. se confirmado, chama DELETE interno;
4. exibe toast;
5. atualiza a lista.

Essa decisao evita modal para uma acao simples e mantem a tabela fluida.

## Feedback

Feedback de sucesso e erro usa toast.

O toast fica no canto superior direito, fecha automaticamente e tambem pode ser
fechado manualmente. O provider limpa timers quando desmonta para evitar
efeitos pendentes.
