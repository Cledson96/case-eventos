import type { NextFunction, Request, Response } from "express";

import { Logger } from "@/shared/utils";
import {
  createEventBodySchema,
  eventParamsSchema,
  listEventParticipantsQuerySchema,
  listEventsQuerySchema,
  subscribeParticipantBodySchema,
} from "../schemas";
import { eventParticipantsService, eventsService } from "../services";

export class EventsController {
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const input = createEventBodySchema.parse(request.body);
      const event = await eventsService.create(input);

      response.created(event, "Evento criado com sucesso");
    } catch (error) {
      Logger.error("[EventsController] Erro ao criar evento", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }

  public async list(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const query = listEventsQuerySchema.parse(request.query);
      const events = await eventsService.list(query);

      response.success(events, "Eventos listados com sucesso");
    } catch (error) {
      Logger.error("[EventsController] Erro ao listar eventos", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }

  public async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const params = eventParamsSchema.parse(request.params);
      const event = await eventsService.findById({ id: params.eventId });

      response.success(event, "Evento encontrado com sucesso");
    } catch (error) {
      Logger.error("[EventsController] Erro ao buscar evento", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }

  public async subscribeParticipant(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = eventParamsSchema.parse(request.params);
      const body = subscribeParticipantBodySchema.parse(request.body);
      const eventParticipant = await eventParticipantsService.subscribe({
        eventId: params.eventId,
        participantId: body.participantId,
      });

      response.created(eventParticipant, "Participante inscrito no evento com sucesso");
    } catch (error) {
      Logger.error("[EventsController] Erro ao inscrever participante no evento", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }

  public async listParticipants(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = eventParamsSchema.parse(request.params);
      const query = listEventParticipantsQuerySchema.parse(request.query);
      const participants = await eventParticipantsService.listParticipants({
        ...query,
        eventId: params.eventId,
      });

      response.success(participants, "Participantes do evento listados com sucesso");
    } catch (error) {
      Logger.error("[EventsController] Erro ao listar participantes do evento", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }
}
