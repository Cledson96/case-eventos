import "server-only";

import { httpClient } from "@/lib/http";
import type { CreateParticipantInput, Paginated, Participant } from "@/types";

class ParticipantsService {
  public async create(input: CreateParticipantInput): Promise<Participant> {
    return httpClient.post<Participant>("/participants", input);
  }

  public async findByEmail(email: string): Promise<Participant | null> {
    const normalized = email.trim().toLowerCase();

    const result = await httpClient.get<Paginated<Participant>>("/participants", {
      params: { search: normalized, limit: 100 },
    });

    return result.data.find((participant) => participant.email === normalized) ?? null;
  }

  public async delete(participantId: string): Promise<Participant> {
    return httpClient.delete<Participant>(`/participants/${participantId}`);
  }
}

export const participantsService = new ParticipantsService();
