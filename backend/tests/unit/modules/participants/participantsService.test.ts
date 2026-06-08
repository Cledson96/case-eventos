import { beforeEach, describe, expect, it, vi } from "vitest";

import { cache } from "@/infrastructure";
import { participantsRepository } from "@/modules/participants/repositories";
import { participantsService } from "@/modules/participants/services";
import { ConflictError } from "@/shared/errors";

vi.mock("@/infrastructure", () => ({
  cache: {
    get: vi.fn(),
    set: vi.fn(),
    invalidateByPrefix: vi.fn(),
  },
}));

vi.mock("@/modules/participants/repositories", () => ({
  participantsRepository: {
    create: vi.fn(),
    findByEmail: vi.fn(),
    list: vi.fn(),
  },
}));

const participantOutput = {
  id: "9a4cd65e-f7ec-4f14-939a-564c87d2f042",
  name: "Ana Souza",
  email: "ana@email.com",
  phone: "11999999999",
  createdAt: "2026-06-08T12:00:00.000Z",
  updatedAt: "2026-06-08T12:00:00.000Z",
};

type ListParticipantsInputFixture = {
  page: number;
  limit: number;
  search: string;
  sort: "name";
  order: "asc";
};

describe("ParticipantsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar participante com e-mail normalizado e invalidar caches de participantes", async () => {
    vi.mocked(participantsRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(participantsRepository.create).mockResolvedValue(participantOutput);

    const result = await participantsService.create({
      name: "Ana Souza",
      email: "ANA@EMAIL.COM",
      phone: "11999999999",
    });

    expect(result).toEqual(participantOutput);
    expect(participantsRepository.findByEmail).toHaveBeenCalledWith("ana@email.com");
    expect(participantsRepository.create).toHaveBeenCalledWith({
      name: "Ana Souza",
      email: "ana@email.com",
      phone: "11999999999",
    });
    expect(cache.invalidateByPrefix).toHaveBeenCalledWith("participants:");
  });

  it("deve lancar ConflictError quando e-mail ja estiver cadastrado", async () => {
    vi.mocked(participantsRepository.findByEmail).mockResolvedValue(participantOutput);

    await expect(
      participantsService.create({
        name: "Ana Souza",
        email: "ana@email.com",
        phone: "11999999999",
      })
    ).rejects.toBeInstanceOf(ConflictError);

    expect(participantsRepository.create).not.toHaveBeenCalled();
    expect(cache.invalidateByPrefix).not.toHaveBeenCalled();
  });

  it("deve retornar listagem de participantes a partir do cache", async () => {
    const paginatedParticipants = {
      data: [participantOutput],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    };

    vi.mocked(cache.get).mockResolvedValue(paginatedParticipants);

    const result = await participantsService.list({
      page: 1,
      limit: 20,
      search: "",
      sort: "name",
      order: "asc",
    });

    expect(result).toEqual(paginatedParticipants);
    expect(participantsRepository.list).not.toHaveBeenCalled();
  });

  it("deve listar participantes pelo repositorio e salvar no cache quando nao houver cache", async () => {
    const paginatedParticipants = {
      data: [participantOutput],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    };
    const input: ListParticipantsInputFixture = {
      page: 1,
      limit: 20,
      search: "ana",
      sort: "name",
      order: "asc",
    };

    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(participantsRepository.list).mockResolvedValue(paginatedParticipants);

    const result = await participantsService.list(input);

    expect(result).toEqual(paginatedParticipants);
    expect(participantsRepository.list).toHaveBeenCalledWith(input);
    expect(cache.set).toHaveBeenCalledWith(
      "participants:list:page=1:limit=20:search=ana:sort=name:order=asc",
      paginatedParticipants
    );
  });
});
