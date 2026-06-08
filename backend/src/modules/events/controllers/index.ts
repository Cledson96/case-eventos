import type { NextFunction, Request, Response } from "express";

import { Logger } from "@/shared/utils";
import { createEventBodySchema, eventParamsSchema, listEventsQuerySchema } from "../schemas";
import { eventsService } from "../services";

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
}
