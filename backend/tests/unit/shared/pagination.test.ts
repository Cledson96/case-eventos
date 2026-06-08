import { describe, expect, it } from "vitest";

import { paginationQuerySchema } from "@/shared/schemas";
import { buildPaginationMeta } from "@/shared/utils";

describe("paginationQuerySchema", () => {
  it("deve aplicar valores padrao quando a query estiver vazia", () => {
    const result = paginationQuerySchema.parse({});

    expect(result).toEqual({
      page: 1,
      limit: 20,
      order: "desc",
    });
  });

  it("deve converter valores de query string para tipos seguros", () => {
    const result = paginationQuerySchema.parse({
      page: "2",
      limit: "10",
      search: " evento ",
      order: "asc",
    });

    expect(result).toEqual({
      page: 2,
      limit: 10,
      search: "evento",
      order: "asc",
    });
  });

  it("deve rejeitar limit acima do maximo permitido", () => {
    expect(() => paginationQuerySchema.parse({ limit: "101" })).toThrow();
  });
});

describe("buildPaginationMeta", () => {
  it("deve calcular total de paginas a partir do total e limite", () => {
    const result = buildPaginationMeta({
      page: 2,
      limit: 10,
      total: 35,
    });

    expect(result).toEqual({
      page: 2,
      limit: 10,
      total: 35,
      totalPages: 4,
    });
  });
});
