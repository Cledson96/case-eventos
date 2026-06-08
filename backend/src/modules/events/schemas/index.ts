import { z } from "zod";

import { paginationQuerySchema } from "@/shared/schemas";

export const createEventBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome e obrigatorio")
    .max(120, "Nome deve ter no maximo 120 caracteres"),
  description: z.string().trim().min(1, "Descricao e obrigatoria"),
  date: z.coerce.date({ error: "Data invalida" }),
});

export const eventParamsSchema = z.object({
  eventId: z.uuid("Id do evento invalido"),
});

export const listEventsQuerySchema = paginationQuerySchema.extend({
  sort: z.enum(["createdAt", "date", "name"]).default("date"),
});

export type CreateEventBody = z.infer<typeof createEventBodySchema>;
export type EventParams = z.infer<typeof eventParamsSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
