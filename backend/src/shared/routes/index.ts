import { Router } from "express";

import { eventsRoutes } from "@/modules/events";
import { participantsRoutes } from "@/modules/participants";

class AppRoutes {
  public readonly router: Router;

  public constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use("/events", eventsRoutes);
    this.router.use("/participants", participantsRoutes);
  }
}

export const appRoutes = new AppRoutes().router;
