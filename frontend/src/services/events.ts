import "server-only";

import { httpClient } from "@/lib/http";
import type {
  CreateEventInput,
  Event,
  EventParticipant,
  EventSubscription,
  ListQuery,
  Paginated,
} from "@/types";

class EventsService {
  public async list(query?: ListQuery): Promise<Paginated<Event>> {
    return httpClient.get<Paginated<Event>>("/events", { params: query });
  }

  public async listUpcoming(limit = 3): Promise<Event[]> {
    const { data } = await this.list({ sort: "date", order: "asc", limit: 50 });
    const now = Date.now();

    return data.filter((event) => new Date(event.date).getTime() > now).slice(0, limit);
  }

  public async findById(eventId: string): Promise<Event> {
    return httpClient.get<Event>(`/events/${eventId}`);
  }

  public async create(input: CreateEventInput): Promise<Event> {
    return httpClient.post<Event>("/events", input);
  }

  public async listParticipants(
    eventId: string,
    query?: ListQuery
  ): Promise<Paginated<EventParticipant>> {
    return httpClient.get<Paginated<EventParticipant>>(`/events/${eventId}/participants`, {
      params: query,
    });
  }

  public async subscribe(eventId: string, participantId: string): Promise<EventSubscription> {
    return httpClient.post<EventSubscription>(`/events/${eventId}/participants`, {
      participantId,
    });
  }
}

export const eventsService = new EventsService();
