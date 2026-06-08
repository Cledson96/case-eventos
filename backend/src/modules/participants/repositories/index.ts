import { database } from "@/infrastructure";
import type { Prisma } from "@/generated/prisma/client";
import { buildPaginationMeta } from "@/shared/utils";
import type {
  CreateParticipantInput,
  ListParticipantsInput,
  ListParticipantsOutput,
  ParticipantOutput,
} from "../types";

type PersistedParticipant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

class ParticipantsRepository {
  private readonly participantSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.ParticipantSelect;

  public async create(input: CreateParticipantInput): Promise<ParticipantOutput> {
    const participant = await database.client.participant.create({
      data: input,
      select: this.participantSelect,
    });

    return this.mapParticipant(participant);
  }

  public async findByEmail(email: string): Promise<ParticipantOutput | null> {
    const participant = await database.client.participant.findUnique({
      where: { email },
      select: this.participantSelect,
    });

    if (!participant) {
      return null;
    }

    return this.mapParticipant(participant);
  }

  public async findById(id: string): Promise<ParticipantOutput | null> {
    const participant = await database.client.participant.findUnique({
      where: { id },
      select: this.participantSelect,
    });

    if (!participant) {
      return null;
    }

    return this.mapParticipant(participant);
  }

  public async list(input: ListParticipantsInput): Promise<ListParticipantsOutput> {
    const where = this.buildWhere(input);
    const orderBy = this.buildOrderBy(input);

    const [total, participants] = where
      ? await Promise.all([
          database.client.participant.count({ where }),
          database.client.participant.findMany({
            where,
            select: this.participantSelect,
            skip: (input.page - 1) * input.limit,
            take: input.limit,
            orderBy,
          }),
        ])
      : await Promise.all([
          database.client.participant.count(),
          database.client.participant.findMany({
            select: this.participantSelect,
            skip: (input.page - 1) * input.limit,
            take: input.limit,
            orderBy,
          }),
        ]);

    return {
      data: participants.map((participant) => this.mapParticipant(participant)),
      meta: buildPaginationMeta({
        page: input.page,
        limit: input.limit,
        total,
      }),
    };
  }

  private mapParticipant(participant: PersistedParticipant): ParticipantOutput {
    return {
      id: participant.id,
      name: participant.name,
      email: participant.email,
      phone: participant.phone,
      createdAt: participant.createdAt.toISOString(),
      updatedAt: participant.updatedAt.toISOString(),
    };
  }

  private buildWhere(input: ListParticipantsInput): Prisma.ParticipantWhereInput | undefined {
    if (!input.search) {
      return undefined;
    }

    return {
      OR: [
        { name: { contains: input.search, mode: "insensitive" } },
        { email: { contains: input.search, mode: "insensitive" } },
        { phone: { contains: input.search, mode: "insensitive" } },
      ],
    };
  }

  private buildOrderBy(input: ListParticipantsInput): Prisma.ParticipantOrderByWithRelationInput {
    if (input.sort === "createdAt") {
      return { createdAt: input.order };
    }

    if (input.sort === "email") {
      return { email: input.order };
    }

    return { name: input.order };
  }
}

export const participantsRepository = new ParticipantsRepository();
