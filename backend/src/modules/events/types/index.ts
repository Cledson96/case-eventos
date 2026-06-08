import type { PaginationQuery } from "@/shared/schemas";
import type { PaginatedResult } from "@/shared/types";

export type EventOutput = {
  id: string;
  name: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEventInput = {
  name: string;
  description: string;
  date: Date;
};

export type EventSortField = "createdAt" | "date" | "name";

export type ListEventsInput = PaginationQuery & {
  sort: EventSortField;
};

export type ListEventsOutput = PaginatedResult<EventOutput>;

export type FindEventByIdInput = {
  id: string;
};
