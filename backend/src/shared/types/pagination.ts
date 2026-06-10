export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<TItem> = {
  data: TItem[];
  meta: PaginationMeta;
};
