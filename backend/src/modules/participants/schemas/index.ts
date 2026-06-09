import { z } from "zod";

import { paginationQuerySchema } from "@/shared/schemas";

export const createParticipantBodySchema = z.object({
  name: z
    .string({ error: "Nome e obrigatorio" })
    .trim()
    .min(1, "Nome e obrigatorio")
    .max(120, "Nome deve ter no maximo 120 caracteres"),
  email: z
    .string({ error: "E-mail e obrigatorio" })
    .trim()
    .min(1, "E-mail e obrigatorio")
    .email("E-mail invalido")
    .max(180, "E-mail deve ter no maximo 180 caracteres")
    .transform((email) => email.toLowerCase()),
  phone: z
    .string({ error: "Telefone e obrigatorio" })
    .trim()
    .min(1, "Telefone e obrigatorio")
    .max(30, "Telefone deve ter no maximo 30 caracteres"),
});

export const listParticipantsQuerySchema = paginationQuerySchema.extend({
  sort: z.enum(["createdAt", "name", "email"], { error: "Ordenacao invalida" }).default("name"),
});

export const participantParamsSchema = z.object({
  participantId: z.uuid({ error: "Id do participante invalido" }),
});

export type CreateParticipantBody = z.infer<typeof createParticipantBodySchema>;
export type ListParticipantsQuery = z.infer<typeof listParticipantsQuerySchema>;
export type ParticipantParams = z.infer<typeof participantParamsSchema>;
