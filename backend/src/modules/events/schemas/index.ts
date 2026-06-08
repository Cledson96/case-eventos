import { z } from "zod";

import { paginationQuerySchema } from "@/shared/schemas";

export const createEventBodySchema = z.object({
  name: z
    .string({ error: "Nome e obrigatorio" })
    .trim()
    .min(1, "Nome e obrigatorio")
    .max(120, "Nome deve ter no maximo 120 caracteres"),
  description: z
    .string({ error: "Descricao e obrigatoria" })
    .trim()
    .min(1, "Descricao e obrigatoria"),
  date: z
    .unknown()
    .refine((value) => value !== undefined && value !== null && value !== "", {
      message: "Data e obrigatoria",
    })
    .pipe(z.coerce.date({ error: "Data invalida" })),
});

export const eventParamsSchema = z.object({
  eventId: z.string({ error: "Id do evento invalido" }).uuid("Id do evento invalido"),
});

export const subscribeParticipantBodySchema = z.object({
  participantId: z
    .string({ error: "Id do participante e obrigatorio" })
    .uuid("Id do participante invalido"),
});

export const listEventsQuerySchema = paginationQuerySchema.extend({
  sort: z.enum(["createdAt", "date", "name"], { error: "Ordenacao invalida" }).default("date"),
});

export const listEventParticipantsQuerySchema = paginationQuerySchema.extend({
  sort: z
    .enum(["createdAt", "name", "email"], { error: "Ordenacao invalida" })
    .default("createdAt"),
});

export type CreateEventBody = z.infer<typeof createEventBodySchema>;
export type EventParams = z.infer<typeof eventParamsSchema>;
export type SubscribeParticipantBody = z.infer<typeof subscribeParticipantBodySchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
export type ListEventParticipantsQuery = z.infer<typeof listEventParticipantsQuerySchema>;
