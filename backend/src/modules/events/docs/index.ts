/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Gerenciamento de eventos
 */
export const eventsTagDocs = true;

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cadastra um evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tech Summit
 *               description:
 *                 type: string
 *                 example: Evento de tecnologia
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-10T15:00:00.000Z"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         description: Dados da requisicao invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               success: false
 *               message: Dados da requisicao invalidos
 *               error:
 *                 code: 400
 *                 details:
 *                   formErrors: []
 *                   fieldErrors:
 *                     name:
 *                       - Nome e obrigatorio
 *                     description:
 *                       - Descricao e obrigatoria
 *                     date:
 *                       - Data e obrigatoria
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Erro interno do servidor
 *               error:
 *                 code: 500
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *   get:
 *     summary: Lista eventos
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, date, name]
 *           default: date
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Eventos listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Event'
 *                         meta:
 *                           $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         description: Parametros de consulta invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               success: false
 *               message: Dados da requisicao invalidos
 *               error:
 *                 code: 400
 *                 details:
 *                   formErrors: []
 *                   fieldErrors:
 *                     sort:
 *                       - Ordenacao invalida
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Erro interno do servidor
 *               error:
 *                 code: 500
 *               timestamp: "2026-06-08T20:28:08.222Z"
 */
export const eventsCollectionDocs = true;

/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     summary: Busca evento por id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Evento encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         description: Id do evento invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               success: false
 *               message: Dados da requisicao invalidos
 *               error:
 *                 code: 400
 *                 details:
 *                   formErrors: []
 *                   fieldErrors:
 *                     eventId:
 *                       - Id do evento invalido
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Evento nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Evento nao encontrado
 *               error:
 *                 code: 404
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Erro interno do servidor
 *               error:
 *                 code: 500
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *   delete:
 *     summary: Exclui evento por id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Evento excluido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         description: Id do evento invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               success: false
 *               message: Dados da requisicao invalidos
 *               error:
 *                 code: 400
 *                 details:
 *                   formErrors: []
 *                   fieldErrors:
 *                     eventId:
 *                       - Id do evento invalido
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Evento nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Evento nao encontrado
 *               error:
 *                 code: 404
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Erro interno do servidor
 *               error:
 *                 code: 500
 *               timestamp: "2026-06-08T20:28:08.222Z"
 */
export const eventByIdDocs = true;

/**
 * @swagger
 * /events/{eventId}/participants:
 *   post:
 *     summary: Inscreve participante em evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantId
 *             properties:
 *               participantId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Participante inscrito no evento com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/EventParticipant'
 *       400:
 *         description: Dados da requisicao invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               success: false
 *               message: Dados da requisicao invalidos
 *               error:
 *                 code: 400
 *                 details:
 *                   formErrors: []
 *                   fieldErrors:
 *                     participantId:
 *                       - Id do participante e obrigatorio
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Evento ou participante nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Participante nao encontrado
 *               error:
 *                 code: 404
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       409:
 *         description: Participante ja inscrito neste evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Participante ja inscrito neste evento
 *               error:
 *                 code: 409
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Erro interno do servidor
 *               error:
 *                 code: 500
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *   get:
 *     summary: Lista participantes de um evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, name, email]
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Participantes do evento listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/EventParticipantItem'
 *                         meta:
 *                           $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         description: Parametros invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               success: false
 *               message: Dados da requisicao invalidos
 *               error:
 *                 code: 400
 *                 details:
 *                   formErrors: []
 *                   fieldErrors:
 *                     eventId:
 *                       - Id do evento invalido
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Evento nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Evento nao encontrado
 *               error:
 *                 code: 404
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Erro interno do servidor
 *               error:
 *                 code: 500
 *               timestamp: "2026-06-08T20:28:08.222Z"
 */
export const eventParticipantsDocs = true;
