import { cache } from "@/infrastructure";
import { ConflictError, NotFoundError } from "@/shared/errors";
import { participantsRepository } from "../repositories";
import type {
  CreateParticipantInput,
  DeleteParticipantInput,
  ListParticipantsInput,
  ListParticipantsOutput,
  ParticipantOutput,
} from "../types";

class ParticipantsService {
  public async create(input: CreateParticipantInput): Promise<ParticipantOutput> {
    const normalizedInput = {
      ...input,
      email: input.email.trim().toLowerCase(),
    };
    const participant = await participantsRepository.findByEmail(normalizedInput.email);

    if (participant) {
      throw new ConflictError("E-mail ja cadastrado");
    }

    const createdParticipant = await participantsRepository.create(normalizedInput);
    await cache.invalidateByPrefix("participants:");

    return createdParticipant;
  }

  public async delete(input: DeleteParticipantInput): Promise<ParticipantOutput> {
    const participant = await participantsRepository.findById(input.id);

    if (!participant) {
      throw new NotFoundError("Participante nao encontrado");
    }

    const deletedParticipant = await participantsRepository.delete(input.id);
    await cache.invalidateByPrefix("participants:");
    await cache.invalidateByPrefix("events:");

    return deletedParticipant;
  }

  public async list(input: ListParticipantsInput): Promise<ListParticipantsOutput> {
    const cacheKey = this.buildListCacheKey(input);
    const cachedParticipants = await cache.get<ListParticipantsOutput>(cacheKey);

    if (cachedParticipants) {
      return cachedParticipants;
    }

    const participants = await participantsRepository.list(input);
    await cache.set(cacheKey, participants);

    return participants;
  }

  private buildListCacheKey(input: ListParticipantsInput): string {
    const search = input.search ?? "";

    return `participants:list:page=${input.page}:limit=${input.limit}:search=${search}:sort=${input.sort}:order=${input.order}`;
  }
}

export const participantsService = new ParticipantsService();
