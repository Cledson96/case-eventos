import { beforeEach, describe, expect, it, vi } from "vitest";

import { cache } from "@/infrastructure";
import { eventsRepository } from "@/modules/events/repositories";
import { eventsService } from "@/modules/events/services";
import { NotFoundError } from "@/shared/errors";

vi.mock("@/infrastructure", () => ({
  cache: {
    get: vi.fn(),
    set: vi.fn(),
    invalidateByPrefix: vi.fn(),
  },
}));

vi.mock("@/modules/events/repositories", () => ({
  eventsRepository: {
    create: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
  },
}));

const eventDate = new Date("2026-07-10T15:00:00.000Z");
const eventOutput = {
  id: "8c209737-6a91-41bd-a28d-9f1d9a05fd1f",
  name: "Tech Summit",
  description: "Evento de tecnologia",
  date: "2026-07-10T15:00:00.000Z",
  createdAt: "2026-06-08T12:00:00.000Z",
  updatedAt: "2026-06-08T12:00:00.000Z",
};

type ListEventsInputFixture = {
  page: number;
  limit: number;
  search: string;
  sort: "date";
  order: "asc";
};

describe("EventsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar evento e invalidar caches de eventos", async () => {
    vi.mocked(eventsRepository.create).mockResolvedValue(eventOutput);

    const result = await eventsService.create({
      name: "Tech Summit",
      description: "Evento de tecnologia",
      date: eventDate,
    });

    expect(result).toEqual(eventOutput);
    expect(eventsRepository.create).toHaveBeenCalledWith({
      name: "Tech Summit",
      description: "Evento de tecnologia",
      date: eventDate,
    });
    expect(cache.invalidateByPrefix).toHaveBeenCalledWith("events:");
  });

  it("deve retornar detalhe do evento a partir do cache", async () => {
    vi.mocked(cache.get).mockResolvedValue(eventOutput);

    const result = await eventsService.findById({ id: eventOutput.id });

    expect(result).toEqual(eventOutput);
    expect(eventsRepository.findById).not.toHaveBeenCalled();
  });

  it("deve buscar detalhe no repositorio e salvar no cache quando nao houver cache", async () => {
    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(eventsRepository.findById).mockResolvedValue(eventOutput);

    const result = await eventsService.findById({ id: eventOutput.id });

    expect(result).toEqual(eventOutput);
    expect(eventsRepository.findById).toHaveBeenCalledWith(eventOutput.id);
    expect(cache.set).toHaveBeenCalledWith(`events:detail:${eventOutput.id}`, eventOutput);
  });

  it("deve lancar NotFoundError quando evento nao existir", async () => {
    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(eventsRepository.findById).mockResolvedValue(null);

    await expect(eventsService.findById({ id: eventOutput.id })).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it("deve excluir evento existente e invalidar caches de eventos", async () => {
    vi.mocked(eventsRepository.findById).mockResolvedValue(eventOutput);
    vi.mocked(eventsRepository.delete).mockResolvedValue(eventOutput);

    const result = await eventsService.delete({ id: eventOutput.id });

    expect(result).toEqual(eventOutput);
    expect(eventsRepository.findById).toHaveBeenCalledWith(eventOutput.id);
    expect(eventsRepository.delete).toHaveBeenCalledWith(eventOutput.id);
    expect(cache.invalidateByPrefix).toHaveBeenCalledWith("events:");
  });

  it("deve lancar NotFoundError ao excluir evento inexistente", async () => {
    vi.mocked(eventsRepository.findById).mockResolvedValue(null);

    await expect(eventsService.delete({ id: eventOutput.id })).rejects.toBeInstanceOf(
      NotFoundError
    );

    expect(eventsRepository.delete).not.toHaveBeenCalled();
    expect(cache.invalidateByPrefix).not.toHaveBeenCalled();
  });

  it("deve lancar NotFoundError quando evento deixar de existir durante a exclusao", async () => {
    vi.mocked(eventsRepository.findById).mockResolvedValue(eventOutput);
    vi.mocked(eventsRepository.delete).mockRejectedValue(
      new NotFoundError("Evento nao encontrado")
    );

    await expect(eventsService.delete({ id: eventOutput.id })).rejects.toMatchObject({
      message: "Evento nao encontrado",
      statusCode: 404,
    });

    expect(cache.invalidateByPrefix).not.toHaveBeenCalled();
  });

  it("deve listar eventos com cache por parametros de consulta", async () => {
    const paginatedEvents = {
      data: [eventOutput],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    };
    const input: ListEventsInputFixture = {
      page: 1,
      limit: 20,
      search: "tech",
      sort: "date",
      order: "asc",
    };

    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(eventsRepository.list).mockResolvedValue(paginatedEvents);

    const result = await eventsService.list(input);

    expect(result).toEqual(paginatedEvents);
    expect(eventsRepository.list).toHaveBeenCalledWith(input);
    expect(cache.set).toHaveBeenCalledWith(
      "events:list:page=1:limit=20:search=tech:sort=date:order=asc",
      paginatedEvents
    );
  });
});
