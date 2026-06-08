import { Router } from "express";

import { ParticipantsController } from "../controllers";

class ParticipantsRoutes {
  public readonly router: Router;
  private readonly participantsController: ParticipantsController;

  public constructor() {
    this.router = Router();
    this.participantsController = new ParticipantsController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post("/", this.participantsController.create.bind(this.participantsController));
    this.router.get("/", this.participantsController.list.bind(this.participantsController));
  }
}

export const participantsRoutes = new ParticipantsRoutes().router;
