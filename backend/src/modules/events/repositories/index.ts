import { database } from "@/infrastructure";
import { executePrismaOperation } from "@/infrastructure/database";
import type { Prisma } from "@/generated/prisma/client";
import { buildPaginationMeta } from "@/shared/utils";
import type {
  CreateEventInput,
  DeleteEventInput,
  EventOutput,
  EventParticipantOutput,
  EventParticipantSubscriptionOutput,
  ListEventParticipantsInput,
  ListEventParticipantsOutput,
  ListEventsInput,
  ListEventsOutput,
  SubscribeParticipantInput,
} from "../types";

type PersistedEvent = {
  id: string;
  name: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

type PersistedEventParticipant = {
  eventId: string;
  participantId: string;
  createdAt: Date;
};

type PersistedEventParticipantWithParticipant = {
  createdAt: Date;
  participant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  };
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

  public async delete(id: DeleteEventInput["id"]): Promise<EventOutput> {
    const event = await executePrismaOperation(
      () =>
        database.client.event.delete({
          where: { id },
          select: this.eventSelect,
        }),
      { notFound: "Evento nao encontrado" }
    );

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

class EventParticipantsRepository {
  private readonly eventParticipantSelect = {
    eventId: true,
    participantId: true,
    createdAt: true,
  } satisfies Prisma.EventParticipantSelect;

  private readonly eventParticipantWithParticipantSelect = {
    createdAt: true,
    participant: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  } satisfies Prisma.EventParticipantSelect;

  public async create(
    input: SubscribeParticipantInput
  ): Promise<EventParticipantSubscriptionOutput> {
    const eventParticipant = await executePrismaOperation(
      () =>
        database.client.eventParticipant.create({
          data: input,
          select: this.eventParticipantSelect,
        }),
      {
        unique: "Participante ja inscrito neste evento",
        foreignKey: "Evento ou participante nao encontrado",
      }
    );

    return this.mapEventParticipant(eventParticipant);
  }

  public async findByIds(
    input: SubscribeParticipantInput
  ): Promise<EventParticipantSubscriptionOutput | null> {
    const eventParticipant = await database.client.eventParticipant.findUnique({
      where: {
        eventId_participantId: input,
      },
      select: this.eventParticipantSelect,
    });

    if (!eventParticipant) {
      return null;
    }

    return this.mapEventParticipant(eventParticipant);
  }

  public async listParticipantsByEventId(
    input: ListEventParticipantsInput
  ): Promise<ListEventParticipantsOutput> {
    const where = this.buildWhere(input);
    const orderBy = this.buildOrderBy(input);

    const [total, eventParticipants] = await Promise.all([
      database.client.eventParticipant.count({ where }),
      database.client.eventParticipant.findMany({
        where,
        select: this.eventParticipantWithParticipantSelect,
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        orderBy,
      }),
    ]);

    return {
      data: eventParticipants.map((eventParticipant) =>
        this.mapEventParticipantWithParticipant(eventParticipant)
      ),
      meta: buildPaginationMeta({
        page: input.page,
        limit: input.limit,
        total,
      }),
    };
  }

  private mapEventParticipant(
    eventParticipant: PersistedEventParticipant
  ): EventParticipantSubscriptionOutput {
    return {
      eventId: eventParticipant.eventId,
      participantId: eventParticipant.participantId,
      createdAt: eventParticipant.createdAt.toISOString(),
    };
  }

  private mapEventParticipantWithParticipant(
    eventParticipant: PersistedEventParticipantWithParticipant
  ): EventParticipantOutput {
    return {
      id: eventParticipant.participant.id,
      name: eventParticipant.participant.name,
      email: eventParticipant.participant.email,
      phone: eventParticipant.participant.phone,
      createdAt: eventParticipant.participant.createdAt.toISOString(),
      updatedAt: eventParticipant.participant.updatedAt.toISOString(),
      registeredAt: eventParticipant.createdAt.toISOString(),
    };
  }

  private buildWhere(input: ListEventParticipantsInput): Prisma.EventParticipantWhereInput {
    const participantWhere = this.buildParticipantWhere(input.search);

    if (!participantWhere) {
      return {
        eventId: input.eventId,
      };
    }

    return {
      eventId: input.eventId,
      participant: {
        is: participantWhere,
      },
    };
  }

  private buildParticipantWhere(search?: string): Prisma.ParticipantWhereInput | undefined {
    if (!search) {
      return undefined;
    }

    return {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  private buildOrderBy(
    input: ListEventParticipantsInput
  ): Prisma.EventParticipantOrderByWithRelationInput {
    if (input.sort === "name") {
      return {
        participant: {
          name: input.order,
        },
      };
    }

    if (input.sort === "email") {
      return {
        participant: {
          email: input.order,
        },
      };
    }

    return {
      createdAt: input.order,
    };
  }
}

export const eventsRepository = new EventsRepository();
export const eventParticipantsRepository = new EventParticipantsRepository();
