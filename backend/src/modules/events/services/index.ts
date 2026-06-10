import { cache } from "@/infrastructure";
import { ConflictError, NotFoundError } from "@/shared/errors";
import { participantsRepository } from "@/modules/participants/repositories";
import { eventParticipantsRepository, eventsRepository } from "../repositories";
import type {
  CreateEventInput,
  DeleteEventInput,
  EventParticipantSubscriptionOutput,
  EventOutput,
  FindEventByIdInput,
  ListEventParticipantsInput,
  ListEventParticipantsOutput,
  ListEventsInput,
  ListEventsOutput,
  SubscribeParticipantInput,
} from "../types";

class EventsService {
  public async create(input: CreateEventInput): Promise<EventOutput> {
    const event = await eventsRepository.create(input);
    await cache.invalidateByPrefix("events:");

    return event;
  }

  public async findById(input: FindEventByIdInput): Promise<EventOutput> {
    const cacheKey = `events:detail:${input.id}`;
    const cachedEvent = await cache.get<EventOutput>(cacheKey);

    if (cachedEvent) {
      return cachedEvent;
    }

    const event = await eventsRepository.findById(input.id);

    if (!event) {
      throw new NotFoundError("Evento nao encontrado");
    }

    await cache.set(cacheKey, event);

    return event;
  }

  public async delete(input: DeleteEventInput): Promise<EventOutput> {
    const event = await eventsRepository.findById(input.id);

    if (!event) {
      throw new NotFoundError("Evento nao encontrado");
    }

    const deletedEvent = await eventsRepository.delete(input.id);
    await cache.invalidateByPrefix("events:");

    return deletedEvent;
  }

  public async list(input: ListEventsInput): Promise<ListEventsOutput> {
    const cacheKey = this.buildListCacheKey(input);
    const cachedEvents = await cache.get<ListEventsOutput>(cacheKey);

    if (cachedEvents) {
      return cachedEvents;
    }

    const events = await eventsRepository.list(input);
    await cache.set(cacheKey, events);

    return events;
  }

  private buildListCacheKey(input: ListEventsInput): string {
    const search = input.search ?? "";

    return `events:list:page=${input.page}:limit=${input.limit}:search=${search}:sort=${input.sort}:order=${input.order}`;
  }
}

class EventParticipantsService {
  public async subscribe(
    input: SubscribeParticipantInput
  ): Promise<EventParticipantSubscriptionOutput> {
    const [event, participant] = await Promise.all([
      eventsRepository.findById(input.eventId),
      participantsRepository.findById(input.participantId),
    ]);

    if (!event) {
      throw new NotFoundError("Evento nao encontrado");
    }

    if (!participant) {
      throw new NotFoundError("Participante nao encontrado");
    }

    const existingEventParticipant = await eventParticipantsRepository.findByIds(input);

    if (existingEventParticipant) {
      throw new ConflictError("Participante ja inscrito neste evento");
    }

    const eventParticipant = await eventParticipantsRepository.create(input);
    await cache.invalidateByPrefix("events:");

    return eventParticipant;
  }

  public async listParticipants(
    input: ListEventParticipantsInput
  ): Promise<ListEventParticipantsOutput> {
    const cacheKey = this.buildListCacheKey(input);
    const cachedParticipants = await cache.get<ListEventParticipantsOutput>(cacheKey);

    if (cachedParticipants) {
      return cachedParticipants;
    }

    const event = await eventsRepository.findById(input.eventId);

    if (!event) {
      throw new NotFoundError("Evento nao encontrado");
    }

    const participants = await eventParticipantsRepository.listParticipantsByEventId(input);
    await cache.set(cacheKey, participants);

    return participants;
  }

  private buildListCacheKey(input: ListEventParticipantsInput): string {
    const search = input.search ?? "";

    return `events:${input.eventId}:participants:page=${input.page}:limit=${input.limit}:search=${search}:sort=${input.sort}:order=${input.order}`;
  }
}

export const eventsService = new EventsService();
export const eventParticipantsService = new EventParticipantsService();
