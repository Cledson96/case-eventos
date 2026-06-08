import "server-only";

import { httpClient } from "@/lib/http";
import type { CreateParticipantInput, Participant } from "@/types";

class ParticipantsService {
  public async create(input: CreateParticipantInput): Promise<Participant> {
    return httpClient.post<Participant>("/participants", input);
  }
}

export const participantsService = new ParticipantsService();
