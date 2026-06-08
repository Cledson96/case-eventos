import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { participantsService } from "@/modules/participants/services";
import { app } from "@/server";
import { ConflictError } from "@/shared/errors";

vi.mock("@/modules/participants/services", () => ({
  participantsService: {
    create: vi.fn(),
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

describe("Participants HTTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar participante com status 201", async () => {
    vi.mocked(participantsService.create).mockResolvedValue(participantOutput);

    const response = await request(app)
      .post("/participants")
      .send({
        name: "Ana Souza",
        email: "ANA@EMAIL.COM",
        phone: "11999999999",
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Participante criado com sucesso");
    expect(response.body.data.email).toBe(participantOutput.email);
    expect(participantsService.create).toHaveBeenCalledWith({
      name: "Ana Souza",
      email: "ana@email.com",
      phone: "11999999999",
    });
  });

  it("deve retornar 400 ao criar participante sem campos obrigatorios", async () => {
    const response = await request(app).post("/participants").send({}).expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Dados da requisicao invalidos");
    expect(response.body.error.code).toBe(400);
    expect(response.body.error.details.fieldErrors.name).toContain("Nome e obrigatorio");
    expect(response.body.error.details.fieldErrors.email).toContain("E-mail e obrigatorio");
    expect(response.body.error.details.fieldErrors.phone).toContain("Telefone e obrigatorio");
    expect(participantsService.create).not.toHaveBeenCalled();
  });

  it("deve retornar 409 quando e-mail ja estiver cadastrado", async () => {
    vi.mocked(participantsService.create).mockRejectedValue(
      new ConflictError("E-mail ja cadastrado")
    );

    const response = await request(app)
      .post("/participants")
      .send({
        name: "Ana Souza",
        email: "ana@email.com",
        phone: "11999999999",
      })
      .expect(409);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("E-mail ja cadastrado");
    expect(response.body.error.code).toBe(409);
  });

  it("deve listar participantes paginados", async () => {
    vi.mocked(participantsService.list).mockResolvedValue({
      data: [participantOutput],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });

    const response = await request(app)
      .get("/participants?page=1&limit=20&search=ana&sort=email&order=asc")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.data).toHaveLength(1);
    expect(response.body.data.meta.total).toBe(1);
    expect(participantsService.list).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      search: "ana",
      sort: "email",
      order: "asc",
    });
  });
});
