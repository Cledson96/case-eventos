import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { app } from "@/server";
import { eventParticipantsService, eventsService } from "@/modules/events/services";
import { ConflictError, NotFoundError } from "@/shared/errors";
import { authHeader } from "./helpers/auth";

vi.mock("@/modules/events/services", () => ({
  eventsService: {
    create: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
  },
  eventParticipantsService: {
    subscribe: vi.fn(),
    listParticipants: vi.fn(),
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
  registeredAt: "2026-06-08T13:00:00.000Z",
};

describe("Events HTTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar evento com status 201", async () => {
    vi.mocked(eventsService.create).mockResolvedValue(eventOutput);

    const response = await request(app)
      .post("/events")
      .set(authHeader)
      .send({
        name: "Tech Summit",
        description: "Evento de tecnologia",
        date: "2026-07-10T15:00:00.000Z",
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Evento criado com sucesso");
    expect(response.body.data.id).toBe(eventOutput.id);
    expect(eventsService.create).toHaveBeenCalledWith({
      name: "Tech Summit",
      description: "Evento de tecnologia",
      date: expect.any(Date),
    });
  });

  it("deve retornar 400 ao criar evento sem campos obrigatorios", async () => {
    const response = await request(app).post("/events").set(authHeader).send({}).expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Dados da requisicao invalidos");
    expect(response.body.error.code).toBe(400);
    expect(response.body.error.details.fieldErrors.name).toContain("Nome e obrigatorio");
    expect(response.body.error.details.fieldErrors.description).toContain(
      "Descricao e obrigatoria"
    );
    expect(response.body.error.details.fieldErrors.date).toContain("Data e obrigatoria");
    expect(eventsService.create).not.toHaveBeenCalled();
  });

  it("deve listar eventos paginados", async () => {
    vi.mocked(eventsService.list).mockResolvedValue({
      data: [eventOutput],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });

    const response = await request(app)
      .get("/events?page=1&limit=20&search=tech&sort=name&order=asc")
      .set(authHeader)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.data).toHaveLength(1);
    expect(response.body.data.meta.total).toBe(1);
    expect(eventsService.list).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      search: "tech",
      sort: "name",
      order: "asc",
    });
  });

  it("deve retornar 404 quando evento nao existir", async () => {
    vi.mocked(eventsService.findById).mockRejectedValue(new NotFoundError("Evento nao encontrado"));

    const response = await request(app)
      .get(`/events/${eventOutput.id}`)
      .set(authHeader)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Evento nao encontrado");
    expect(response.body.error.code).toBe(404);
  });

  it("deve retornar 409 quando participante ja estiver inscrito no evento", async () => {
    vi.mocked(eventParticipantsService.subscribe).mockRejectedValue(
      new ConflictError("Participante ja inscrito neste evento")
    );

    const response = await request(app)
      .post(`/events/${eventOutput.id}/participants`)
      .set(authHeader)
      .send({ participantId: participantOutput.id })
      .expect(409);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Participante ja inscrito neste evento");
    expect(response.body.error.code).toBe(409);
  });

  it("deve listar participantes do evento", async () => {
    vi.mocked(eventParticipantsService.listParticipants).mockResolvedValue({
      data: [participantOutput],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });

    const response = await request(app)
      .get(`/events/${eventOutput.id}/participants?page=1&limit=20&sort=email&order=asc`)
      .set(authHeader)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.data[0].email).toBe(participantOutput.email);
    expect(eventParticipantsService.listParticipants).toHaveBeenCalledWith({
      eventId: eventOutput.id,
      page: 1,
      limit: 20,
      sort: "email",
      order: "asc",
    });
  });
});
