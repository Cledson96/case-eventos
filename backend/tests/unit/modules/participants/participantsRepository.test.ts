import { beforeEach, describe, expect, it, vi } from "vitest";

import { Prisma } from "@/generated/prisma/client";
import { participantsRepository } from "@/modules/participants/repositories";

const databaseMock = vi.hoisted(() => ({
  participant: {
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/infrastructure", () => ({
  database: {
    client: {
      participant: databaseMock.participant,
    },
  },
}));

function buildPrismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("Erro conhecido do Prisma", {
    code,
    clientVersion: "7.8.0",
  });
}

describe("ParticipantsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve mapear erro de e-mail duplicado para ConflictError", async () => {
    databaseMock.participant.create.mockRejectedValue(buildPrismaError("P2002"));

    await expect(
      participantsRepository.create({
        name: "Ana Souza",
        email: "ana@email.com",
        phone: "11999999999",
      })
    ).rejects.toMatchObject({
      message: "E-mail ja cadastrado",
      statusCode: 409,
    });
  });

  it("deve mapear exclusao de participante inexistente para NotFoundError", async () => {
    databaseMock.participant.delete.mockRejectedValue(buildPrismaError("P2025"));

    await expect(
      participantsRepository.delete("9a4cd65e-f7ec-4f14-939a-564c87d2f042")
    ).rejects.toMatchObject({
      message: "Participante nao encontrado",
      statusCode: 404,
    });
  });
});
