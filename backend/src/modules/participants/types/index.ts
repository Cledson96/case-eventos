import type { PaginationQuery } from "@/shared/schemas";
import type { PaginatedResult } from "@/shared/types";

export type ParticipantOutput = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateParticipantInput = {
  name: string;
  email: string;
  phone: string;
};

export type ParticipantSortField = "createdAt" | "name" | "email";

export type ListParticipantsInput = PaginationQuery & {
  sort: ParticipantSortField;
};

export type ListParticipantsOutput = PaginatedResult<ParticipantOutput>;
