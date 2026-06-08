import type { PaginationMeta } from "@/shared/types";

type BuildPaginationMetaInput = {
  page: number;
  limit: number;
  total: number;
};

export function buildPaginationMeta(input: BuildPaginationMetaInput): PaginationMeta {
  return {
    page: input.page,
    limit: input.limit,
    total: input.total,
    totalPages: Math.ceil(input.total / input.limit),
  };
}
