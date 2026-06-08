import { Router } from "express";

import { eventsRoutes } from "@/modules/events";
import { participantsRoutes } from "@/modules/participants";
import { authenticateApiToken } from "@/shared/middlewares";

class AppRoutes {
  public readonly router: Router;

  public constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use(authenticateApiToken);
    this.router.use("/events", eventsRoutes);
    this.router.use("/participants", participantsRoutes);
  }
}

export const appRoutes = new AppRoutes().router;
