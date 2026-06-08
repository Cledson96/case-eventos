import type { NextFunction, Request, Response } from "express";

import { Logger } from "@/shared/utils";
import { createParticipantBodySchema, listParticipantsQuerySchema } from "../schemas";
import { participantsService } from "../services";

export class ParticipantsController {
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const input = createParticipantBodySchema.parse(request.body);
      const participant = await participantsService.create(input);

      response.created(participant, "Participante criado com sucesso");
    } catch (error) {
      Logger.error("[ParticipantsController] Erro ao criar participante", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }

  public async list(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const query = listParticipantsQuerySchema.parse(request.query);
      const participants = await participantsService.list(query);

      response.success(participants, "Participantes listados com sucesso");
    } catch (error) {
      Logger.error("[ParticipantsController] Erro ao listar participantes", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }
}
