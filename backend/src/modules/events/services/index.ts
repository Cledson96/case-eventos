import { cache } from "@/infrastructure";
import { NotFoundError } from "@/shared/errors";
import { eventsRepository } from "../repositories";
import type {
  CreateEventInput,
  EventOutput,
  FindEventByIdInput,
  ListEventsInput,
  ListEventsOutput,
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

export const eventsService = new EventsService();
