import { Router } from "express";

import { eventsRoutes } from "@/modules/events";

class AppRoutes {
  public readonly router: Router;

  public constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use("/events", eventsRoutes);
  }
}

export const appRoutes = new AppRoutes().router;
