import { Router } from "express";

import { EventsController } from "../controllers";

class EventsRoutes {
  public readonly router: Router;
  private readonly eventsController: EventsController;

  public constructor() {
    this.router = Router();
    this.eventsController = new EventsController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/:eventId/participants",
      this.eventsController.subscribeParticipant.bind(this.eventsController)
    );
    this.router.get(
      "/:eventId/participants",
      this.eventsController.listParticipants.bind(this.eventsController)
    );
    this.router.post("/", this.eventsController.create.bind(this.eventsController));
    this.router.get("/", this.eventsController.list.bind(this.eventsController));
    this.router.get("/:eventId", this.eventsController.findById.bind(this.eventsController));
  }
}

export const eventsRoutes = new EventsRoutes().router;
