import type { NextFunction, Request } from "express";

import type { ValidatedResponse } from "@/shared/middlewares";
import { Logger } from "@/shared/utils";
import type {
  CreateEventBody,
  EventParams,
  ListEventParticipantsQuery,
  ListEventsQuery,
  SubscribeParticipantBody,
} from "../schemas";
import { eventParticipantsService, eventsService } from "../services";

export class EventsController {
  public async create(
    request: Request,
    response: ValidatedResponse<CreateEventBody>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { body } = response.locals.validatedRequest;
      const event = await eventsService.create(body);

      response.created(event, "Evento criado com sucesso");
    } catch (error) {
      Logger.error("[EventsController] Erro ao criar evento", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }

  public async list(
    request: Request,
    response: ValidatedResponse<unknown, ListEventsQuery>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { query } = response.locals.validatedRequest;
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

  public async findById(
    request: Request,
    response: ValidatedResponse<unknown, unknown, EventParams>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { params } = response.locals.validatedRequest;
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

  public async delete(
    request: Request,
    response: ValidatedResponse<unknown, unknown, EventParams>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { params } = response.locals.validatedRequest;
      const event = await eventsService.delete({ id: params.eventId });

      response.success(event, "Evento excluido com sucesso");
    } catch (error) {
      Logger.error("[EventsController] Erro ao excluir evento", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }

  public async subscribeParticipant(
    request: Request,
    response: ValidatedResponse<SubscribeParticipantBody, unknown, EventParams>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { body, params } = response.locals.validatedRequest;
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
    response: ValidatedResponse<unknown, ListEventParticipantsQuery, EventParams>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { query, params } = response.locals.validatedRequest;
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
