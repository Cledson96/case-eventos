import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { database } from "@/infrastructure";
import { eventParticipantsRepository, eventsRepository } from "@/modules/events/repositories";
import { participantsRepository } from "@/modules/participants/repositories";
import { app } from "@/server";
import { Env } from "@/shared/config";

const authHeader = {
  Authorization: `Bearer ${Env.apiToken}`,
};

const unknownEventId = "8c209737-6a91-41bd-a28d-9f1d9a05fd1f";
const unknownParticipantId = "9a4cd65e-f7ec-4f14-939a-564c87d2f042";

function ensureString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Valor esperado como string");
  }

  return value;
}

async function cleanupDatabase(): Promise<void> {
  await database.client.eventParticipant.deleteMany();
  await database.client.participant.deleteMany();
  await database.client.event.deleteMany();
}

describe("Banco real de eventos e participantes", () => {
  beforeAll(async () => {
    await database.connect();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await database.disconnect();
  });

  it("deve executar o fluxo HTTP completo usando PostgreSQL real", async () => {
    const eventResponse = await request(app)
      .post("/events")
      .set(authHeader)
      .send({
        name: "Integration Summit",
        description: "Evento para teste com banco real",
        date: "2026-07-10T15:00:00.000Z",
      })
      .expect(201);

    const participantResponse = await request(app)
      .post("/participants")
      .set(authHeader)
      .send({
        name: "Ana Integracao",
        email: "ana.integration@example.com",
        phone: "11999999999",
      })
      .expect(201);

    const eventId = ensureString(eventResponse.body.data.id);
    const participantId = ensureString(participantResponse.body.data.id);

    await request(app)
      .post(`/events/${eventId}/participants`)
      .set(authHeader)
      .send({ participantId })
      .expect(201);

    const listResponse = await request(app)
      .get(`/events/${eventId}/participants?page=1&limit=20&sort=email&order=asc`)
      .set(authHeader)
      .expect(200);

    expect(listResponse.body.success).toBe(true);
    expect(listResponse.body.data.data).toHaveLength(1);
    expect(listResponse.body.data.data[0]).toEqual(
      expect.objectContaining({
        id: participantId,
        email: "ana.integration@example.com",
      })
    );
    expect(listResponse.body.data.meta).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it("deve respeitar constraints reais de e-mail e inscricao duplicados", async () => {
    await request(app)
      .post("/participants")
      .set(authHeader)
      .send({
        name: "Carlos Integracao",
        email: "carlos.integration@example.com",
        phone: "11988888888",
      })
      .expect(201);

    const duplicatedEmailResponse = await request(app)
      .post("/participants")
      .set(authHeader)
      .send({
        name: "Carlos Duplicado",
        email: "carlos.integration@example.com",
        phone: "11977777777",
      })
      .expect(409);

    expect(duplicatedEmailResponse.body.message).toBe("E-mail ja cadastrado");

    const eventResponse = await request(app)
      .post("/events")
      .set(authHeader)
      .send({
        name: "Duplicidade Summit",
        description: "Evento para validar inscricao duplicada",
        date: "2026-08-10T15:00:00.000Z",
      })
      .expect(201);

    const participantResponse = await request(app)
      .post("/participants")
      .set(authHeader)
      .send({
        name: "Maria Integracao",
        email: "maria.integration@example.com",
        phone: "11966666666",
      })
      .expect(201);

    const eventId = ensureString(eventResponse.body.data.id);
    const participantId = ensureString(participantResponse.body.data.id);

    await request(app)
      .post(`/events/${eventId}/participants`)
      .set(authHeader)
      .send({ participantId })
      .expect(201);

    const duplicatedSubscriptionResponse = await request(app)
      .post(`/events/${eventId}/participants`)
      .set(authHeader)
      .send({ participantId })
      .expect(409);

    expect(duplicatedSubscriptionResponse.body.message).toBe(
      "Participante ja inscrito neste evento"
    );
  });

  it("deve mapear constraints reais do Prisma para erros HTTP de dominio", async () => {
    await expect(eventsRepository.delete(unknownEventId)).rejects.toMatchObject({
      message: "Evento nao encontrado",
      statusCode: 404,
    });

    await expect(participantsRepository.delete(unknownParticipantId)).rejects.toMatchObject({
      message: "Participante nao encontrado",
      statusCode: 404,
    });

    await expect(
      eventParticipantsRepository.create({
        eventId: unknownEventId,
        participantId: unknownParticipantId,
      })
    ).rejects.toMatchObject({
      message: "Evento ou participante nao encontrado",
      statusCode: 404,
    });
  });
});
