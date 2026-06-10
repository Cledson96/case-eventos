import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number({ error: "Pagina deve ser um numero valido" })
    .int("Pagina deve ser um numero inteiro")
    .positive("Pagina deve ser maior que zero")
    .default(1),
  limit: z.coerce
    .number({ error: "Limite deve ser um numero valido" })
    .int("Limite deve ser um numero inteiro")
    .positive("Limite deve ser maior que zero")
    .max(100, "Limite deve ser no maximo 100")
    .default(20),
  search: z
    .string({ error: "Busca deve ser texto" })
    .trim()
    .min(1, "Busca nao pode ser vazia")
    .optional(),
  order: z.enum(["asc", "desc"], { error: "Ordem deve ser asc ou desc" }).default("desc"),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
