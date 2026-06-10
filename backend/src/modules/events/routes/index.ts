import { Router } from "express";

import { validateRequest } from "@/shared/middlewares";
import { EventsController } from "../controllers";
import {
  createEventBodySchema,
  eventParamsSchema,
  listEventParticipantsQuerySchema,
  listEventsQuerySchema,
  subscribeParticipantBodySchema,
} from "../schemas";

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
      validateRequest({ params: eventParamsSchema, body: subscribeParticipantBodySchema }),
      this.eventsController.subscribeParticipant.bind(this.eventsController)
    );
    this.router.get(
      "/:eventId/participants",
      validateRequest({ params: eventParamsSchema, query: listEventParticipantsQuerySchema }),
      this.eventsController.listParticipants.bind(this.eventsController)
    );
    this.router.post(
      "/",
      validateRequest({ body: createEventBodySchema }),
      this.eventsController.create.bind(this.eventsController)
    );
    this.router.get(
      "/",
      validateRequest({ query: listEventsQuerySchema }),
      this.eventsController.list.bind(this.eventsController)
    );
    this.router.get(
      "/:eventId",
      validateRequest({ params: eventParamsSchema }),
      this.eventsController.findById.bind(this.eventsController)
    );
    this.router.delete(
      "/:eventId",
      validateRequest({ params: eventParamsSchema }),
      this.eventsController.delete.bind(this.eventsController)
    );
  }
}

export const eventsRoutes = new EventsRoutes().router;
