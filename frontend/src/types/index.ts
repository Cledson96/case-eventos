export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type Participant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

export type EventParticipant = Participant & {
  registeredAt: string;
};

export type EventSubscription = {
  eventId: string;
  participantId: string;
  createdAt: string;
};

export type CreateEventInput = {
  name: string;
  description: string;
  date: string;
};

export type CreateParticipantInput = {
  name: string;
  email: string;
  phone: string;
};

export type ListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
};
