import { database } from "@/infrastructure";
import type { Prisma } from "@/generated/prisma/client";
import { buildPaginationMeta } from "@/shared/utils";
import type { CreateEventInput, EventOutput, ListEventsInput, ListEventsOutput } from "../types";

type PersistedEvent = {
  id: string;
  name: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

class EventsRepository {
  private readonly eventSelect = {
    id: true,
    name: true,
    description: true,
    date: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.EventSelect;

  public async create(input: CreateEventInput): Promise<EventOutput> {
    const event = await database.client.event.create({
      data: input,
      select: this.eventSelect,
    });

    return this.mapEvent(event);
  }

  public async findById(id: string): Promise<EventOutput | null> {
    const event = await database.client.event.findUnique({
      where: { id },
      select: this.eventSelect,
    });

    if (!event) {
      return null;
    }

    return this.mapEvent(event);
  }

  public async list(input: ListEventsInput): Promise<ListEventsOutput> {
    const where = this.buildWhere(input);
    const orderBy = this.buildOrderBy(input);

    const [total, events] = where
      ? await Promise.all([
          database.client.event.count({ where }),
          database.client.event.findMany({
            where,
            select: this.eventSelect,
            skip: (input.page - 1) * input.limit,
            take: input.limit,
            orderBy,
          }),
        ])
      : await Promise.all([
          database.client.event.count(),
          database.client.event.findMany({
            select: this.eventSelect,
            skip: (input.page - 1) * input.limit,
            take: input.limit,
            orderBy,
          }),
        ]);

    return {
      data: events.map((event) => this.mapEvent(event)),
      meta: buildPaginationMeta({
        page: input.page,
        limit: input.limit,
        total,
      }),
    };
  }

  private mapEvent(event: PersistedEvent): EventOutput {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }

  private buildWhere(input: ListEventsInput): Prisma.EventWhereInput | undefined {
    if (!input.search) {
      return undefined;
    }

    return {
      OR: [
        { name: { contains: input.search, mode: "insensitive" } },
        { description: { contains: input.search, mode: "insensitive" } },
      ],
    };
  }

  private buildOrderBy(input: ListEventsInput): Prisma.EventOrderByWithRelationInput {
    if (input.sort === "createdAt") {
      return { createdAt: input.order };
    }

    if (input.sort === "name") {
      return { name: input.order };
    }

    return { date: input.order };
  }
}

export const eventsRepository = new EventsRepository();
