import type { NextFunction, Request } from "express";

import type { ValidatedResponse } from "@/shared/middlewares";
import { Logger } from "@/shared/utils";
import type { CreateParticipantBody, ListParticipantsQuery } from "../schemas";
import { participantsService } from "../services";

export class ParticipantsController {
  public async create(
    request: Request,
    response: ValidatedResponse<CreateParticipantBody>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { body } = response.locals.validatedRequest;
      const participant = await participantsService.create(body);

      response.created(participant, "Participante criado com sucesso");
    } catch (error) {
      Logger.error("[ParticipantsController] Erro ao criar participante", {
        requestId: request.requestId,
        error,
      });
      next(error);
    }
  }

  public async list(
    request: Request,
    response: ValidatedResponse<unknown, ListParticipantsQuery>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { query } = response.locals.validatedRequest;
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
