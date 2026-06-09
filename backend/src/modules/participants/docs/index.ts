/**
 * @swagger
 * tags:
 *   - name: Participants
 *     description: Gerenciamento de participantes
 */

/**
 * @swagger
 * /participants:
 *   post:
 *     summary: Cadastra um participante
 *     tags: [Participants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ana Souza
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ana@email.com
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *     responses:
 *       201:
 *         description: Participante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Participant'
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
 *                     email:
 *                       - E-mail e obrigatorio
 *                     phone:
 *                       - Telefone e obrigatorio
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       409:
 *         description: E-mail ja cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: E-mail ja cadastrado
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
 *     summary: Lista participantes
 *     tags: [Participants]
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
 *           enum: [createdAt, name, email]
 *           default: name
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Participantes listados com sucesso
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
 *                             $ref: '#/components/schemas/Participant'
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
 *                     page:
 *                       - Pagina deve ser maior que zero
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

/**
 * @swagger
 * /participants/{participantId}:
 *   delete:
 *     summary: Exclui participante por id
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Participante excluido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Participant'
 *       400:
 *         description: Id do participante invalido
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
 *                       - Id do participante invalido
 *               timestamp: "2026-06-08T20:28:08.222Z"
 *       404:
 *         description: Participante nao encontrado
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

export {};
