import { z } from "zod";

import { paginationQuerySchema } from "@/shared/schemas";

export const createParticipantBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome e obrigatorio")
    .max(120, "Nome deve ter no maximo 120 caracteres"),
  email: z
    .string()
    .trim()
    .email("E-mail invalido")
    .max(180, "E-mail deve ter no maximo 180 caracteres")
    .transform((email) => email.toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(1, "Telefone e obrigatorio")
    .max(30, "Telefone deve ter no maximo 30 caracteres"),
});

export const listParticipantsQuerySchema = paginationQuerySchema.extend({
  sort: z.enum(["createdAt", "name", "email"]).default("name"),
});

export type CreateParticipantBody = z.infer<typeof createParticipantBodySchema>;
export type ListParticipantsQuery = z.infer<typeof listParticipantsQuerySchema>;
