import { beforeEach, describe, expect, it, vi } from "vitest";

import { cache } from "@/infrastructure";
import { eventParticipantsRepository, eventsRepository } from "@/modules/events/repositories";
import { eventParticipantsService } from "@/modules/events/services";
import { participantsRepository } from "@/modules/participants/repositories";
import { ConflictError, NotFoundError } from "@/shared/errors";

vi.mock("@/infrastructure", () => ({
  cache: {
    get: vi.fn(),
    set: vi.fn(),
    invalidateByPrefix: vi.fn(),
  },
}));

vi.mock("@/modules/events/repositories", () => ({
  eventsRepository: {
    findById: vi.fn(),
  },
  eventParticipantsRepository: {
    create: vi.fn(),
    findByIds: vi.fn(),
    listParticipantsByEventId: vi.fn(),
  },
}));

vi.mock("@/modules/participants/repositories", () => ({
  participantsRepository: {
    findById: vi.fn(),
  },
}));

const eventOutput = {
  id: "8c209737-6a91-41bd-a28d-9f1d9a05fd1f",
  name: "Tech Summit",
  description: "Evento de tecnologia",
  date: "2026-07-10T15:00:00.000Z",
  createdAt: "2026-06-08T12:00:00.000Z",
  updatedAt: "2026-06-08T12:00:00.000Z",
};

const participantOutput = {
  id: "9a4cd65e-f7ec-4f14-939a-564c87d2f042",
  name: "Ana Souza",
  email: "ana@email.com",
  phone: "11999999999",
  createdAt: "2026-06-08T12:00:00.000Z",
  updatedAt: "2026-06-08T12:00:00.000Z",
};

const eventParticipantOutput = {
  eventId: eventOutput.id,
  participantId: participantOutput.id,
  createdAt: "2026-06-08T13:00:00.000Z",
};

const listedParticipantOutput = {
  ...participantOutput,
  registeredAt: "2026-06-08T13:00:00.000Z",
};

type ListEventParticipantsInputFixture = {
  eventId: string;
  page: number;
  limit: number;
  search: string;
  sort: "name";
  order: "asc";
};

describe("EventParticipantsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve inscrever participante em evento e invalidar caches de eventos", async () => {
    vi.mocked(eventsRepository.findById).mockResolvedValue(eventOutput);
    vi.mocked(participantsRepository.findById).mockResolvedValue(participantOutput);
    vi.mocked(eventParticipantsRepository.findByIds).mockResolvedValue(null);
    vi.mocked(eventParticipantsRepository.create).mockResolvedValue(eventParticipantOutput);

    const result = await eventParticipantsService.subscribe({
      eventId: eventOutput.id,
      participantId: participantOutput.id,
    });

    expect(result).toEqual(eventParticipantOutput);
    expect(eventsRepository.findById).toHaveBeenCalledWith(eventOutput.id);
    expect(participantsRepository.findById).toHaveBeenCalledWith(participantOutput.id);
    expect(eventParticipantsRepository.findByIds).toHaveBeenCalledWith({
      eventId: eventOutput.id,
      participantId: participantOutput.id,
    });
    expect(eventParticipantsRepository.create).toHaveBeenCalledWith({
      eventId: eventOutput.id,
      participantId: participantOutput.id,
    });
    expect(cache.invalidateByPrefix).toHaveBeenCalledWith("events:");
  });

  it("deve lancar NotFoundError quando evento nao existir", async () => {
    vi.mocked(eventsRepository.findById).mockResolvedValue(null);
    vi.mocked(participantsRepository.findById).mockResolvedValue(participantOutput);

    await expect(
      eventParticipantsService.subscribe({
        eventId: eventOutput.id,
        participantId: participantOutput.id,
      })
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(eventParticipantsRepository.create).not.toHaveBeenCalled();
  });

  it("deve lancar NotFoundError quando participante nao existir", async () => {
    vi.mocked(eventsRepository.findById).mockResolvedValue(eventOutput);
    vi.mocked(participantsRepository.findById).mockResolvedValue(null);

    await expect(
      eventParticipantsService.subscribe({
        eventId: eventOutput.id,
        participantId: participantOutput.id,
      })
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(eventParticipantsRepository.create).not.toHaveBeenCalled();
  });

  it("deve lancar ConflictError quando participante ja estiver inscrito", async () => {
    vi.mocked(eventsRepository.findById).mockResolvedValue(eventOutput);
    vi.mocked(participantsRepository.findById).mockResolvedValue(participantOutput);
    vi.mocked(eventParticipantsRepository.findByIds).mockResolvedValue(eventParticipantOutput);

    await expect(
      eventParticipantsService.subscribe({
        eventId: eventOutput.id,
        participantId: participantOutput.id,
      })
    ).rejects.toBeInstanceOf(ConflictError);

    expect(eventParticipantsRepository.create).not.toHaveBeenCalled();
    expect(cache.invalidateByPrefix).not.toHaveBeenCalled();
  });

  it("deve lancar ConflictError quando inscricao duplicada ocorrer durante a criacao", async () => {
    vi.mocked(eventsRepository.findById).mockResolvedValue(eventOutput);
    vi.mocked(participantsRepository.findById).mockResolvedValue(participantOutput);
    vi.mocked(eventParticipantsRepository.findByIds).mockResolvedValue(null);
    vi.mocked(eventParticipantsRepository.create).mockRejectedValue(
      new ConflictError("Participante ja inscrito neste evento")
    );

    await expect(
      eventParticipantsService.subscribe({
        eventId: eventOutput.id,
        participantId: participantOutput.id,
      })
    ).rejects.toMatchObject({
      message: "Participante ja inscrito neste evento",
      statusCode: 409,
    });

    expect(cache.invalidateByPrefix).not.toHaveBeenCalled();
  });

  it("deve lancar NotFoundError quando vinculo relacionado deixar de existir durante a inscricao", async () => {
    vi.mocked(eventsRepository.findById).mockResolvedValue(eventOutput);
    vi.mocked(participantsRepository.findById).mockResolvedValue(participantOutput);
    vi.mocked(eventParticipantsRepository.findByIds).mockResolvedValue(null);
    vi.mocked(eventParticipantsRepository.create).mockRejectedValue(
      new NotFoundError("Evento ou participante nao encontrado")
    );

    await expect(
      eventParticipantsService.subscribe({
        eventId: eventOutput.id,
        participantId: participantOutput.id,
      })
    ).rejects.toMatchObject({
      message: "Evento ou participante nao encontrado",
      statusCode: 404,
    });

    expect(cache.invalidateByPrefix).not.toHaveBeenCalled();
  });

  it("deve retornar participantes do evento a partir do cache", async () => {
    const paginatedParticipants = {
      data: [listedParticipantOutput],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    };

    vi.mocked(cache.get).mockResolvedValue(paginatedParticipants);

    const result = await eventParticipantsService.listParticipants({
      eventId: eventOutput.id,
      page: 1,
      limit: 20,
      search: "",
      sort: "name",
      order: "asc",
    });

    expect(result).toEqual(paginatedParticipants);
    expect(eventParticipantsRepository.listParticipantsByEventId).not.toHaveBeenCalled();
  });

  it("deve listar participantes do evento pelo repositorio e salvar no cache", async () => {
    const paginatedParticipants = {
      data: [listedParticipantOutput],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    };
    const input: ListEventParticipantsInputFixture = {
      eventId: eventOutput.id,
      page: 1,
      limit: 20,
      search: "ana",
      sort: "name",
      order: "asc",
    };

    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(eventsRepository.findById).mockResolvedValue(eventOutput);
    vi.mocked(eventParticipantsRepository.listParticipantsByEventId).mockResolvedValue(
      paginatedParticipants
    );

    const result = await eventParticipantsService.listParticipants(input);

    expect(result).toEqual(paginatedParticipants);
    expect(eventsRepository.findById).toHaveBeenCalledWith(eventOutput.id);
    expect(eventParticipantsRepository.listParticipantsByEventId).toHaveBeenCalledWith(input);
    expect(cache.set).toHaveBeenCalledWith(
      `events:${eventOutput.id}:participants:page=1:limit=20:search=ana:sort=name:order=asc`,
      paginatedParticipants
    );
  });
});
