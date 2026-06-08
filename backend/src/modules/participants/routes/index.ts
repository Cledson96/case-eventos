import { Router } from "express";

import { validateRequest } from "@/shared/middlewares";
import { ParticipantsController } from "../controllers";
import { createParticipantBodySchema, listParticipantsQuerySchema } from "../schemas";

class ParticipantsRoutes {
  public readonly router: Router;
  private readonly participantsController: ParticipantsController;

  public constructor() {
    this.router = Router();
    this.participantsController = new ParticipantsController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/",
      validateRequest({ body: createParticipantBodySchema }),
      this.participantsController.create.bind(this.participantsController)
    );
    this.router.get(
      "/",
      validateRequest({ query: listParticipantsQuerySchema }),
      this.participantsController.list.bind(this.participantsController)
    );
  }
}

export const participantsRoutes = new ParticipantsRoutes().router;
