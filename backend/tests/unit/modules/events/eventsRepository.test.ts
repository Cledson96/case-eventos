import { beforeEach, describe, expect, it, vi } from "vitest";

import { Prisma } from "@/generated/prisma/client";
import { eventParticipantsRepository, eventsRepository } from "@/modules/events/repositories";

const databaseMock = vi.hoisted(() => ({
  event: {
    delete: vi.fn(),
  },
  eventParticipant: {
    create: vi.fn(),
  },
}));

vi.mock("@/infrastructure", () => ({
  database: {
    client: {
      event: databaseMock.event,
      eventParticipant: databaseMock.eventParticipant,
    },
  },
}));

function buildPrismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("Erro conhecido do Prisma", {
    code,
    clientVersion: "7.8.0",
  });
}

describe("EventsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve mapear exclusao de evento inexistente para NotFoundError", async () => {
    databaseMock.event.delete.mockRejectedValue(buildPrismaError("P2025"));

    await expect(
      eventsRepository.delete("8c209737-6a91-41bd-a28d-9f1d9a05fd1f")
    ).rejects.toMatchObject({
      message: "Evento nao encontrado",
      statusCode: 404,
    });
  });
});

describe("EventParticipantsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve mapear inscricao duplicada para ConflictError", async () => {
    databaseMock.eventParticipant.create.mockRejectedValue(buildPrismaError("P2002"));

    await expect(
      eventParticipantsRepository.create({
        eventId: "8c209737-6a91-41bd-a28d-9f1d9a05fd1f",
        participantId: "9a4cd65e-f7ec-4f14-939a-564c87d2f042",
      })
    ).rejects.toMatchObject({
      message: "Participante ja inscrito neste evento",
      statusCode: 409,
    });
  });

  it("deve mapear vinculo relacionado inexistente para NotFoundError", async () => {
    databaseMock.eventParticipant.create.mockRejectedValue(buildPrismaError("P2003"));

    await expect(
      eventParticipantsRepository.create({
        eventId: "8c209737-6a91-41bd-a28d-9f1d9a05fd1f",
        participantId: "9a4cd65e-f7ec-4f14-939a-564c87d2f042",
      })
    ).rejects.toMatchObject({
      message: "Evento ou participante nao encontrado",
      statusCode: 404,
    });
  });
});
