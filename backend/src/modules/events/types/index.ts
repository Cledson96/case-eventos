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

export type SubscribeParticipantInput = {
  eventId: string;
  participantId: string;
};

export type EventParticipantSubscriptionOutput = {
  eventId: string;
  participantId: string;
  createdAt: string;
};

export type EventParticipantOutput = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  registeredAt: string;
};

export type EventParticipantSortField = "createdAt" | "name" | "email";

export type ListEventParticipantsInput = PaginationQuery & {
  eventId: string;
  sort: EventParticipantSortField;
};

export type ListEventParticipantsOutput = PaginatedResult<EventParticipantOutput>;
