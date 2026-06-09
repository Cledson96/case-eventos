import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { database } from "@/infrastructure";

describe("Indices do banco real", () => {
  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  it("deve manter indices alinhados com filtros e ordenacoes principais", async () => {
    const indexes = await database.client.$queryRaw<{ indexname: string }[]>`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = current_schema()
        AND tablename IN ('Event', 'Participant', 'EventParticipant')
    `;
    const indexNames = indexes.map((index) => index.indexname);

    expect(indexNames).toContain("Event_date_idx");
    expect(indexNames).toContain("Event_name_idx");
    expect(indexNames).toContain("Event_createdAt_idx");
    expect(indexNames).toContain("Participant_name_idx");
    expect(indexNames).toContain("Participant_createdAt_idx");
    expect(indexNames).toContain("EventParticipant_participantId_idx");
    expect(indexNames).toContain("EventParticipant_eventId_createdAt_idx");
  });
});
