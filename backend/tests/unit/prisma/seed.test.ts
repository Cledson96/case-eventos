import { describe, expect, it } from "vitest";

import {
  buildSeedEvents,
  buildSeedParticipants,
  buildSeedSubscriptions,
  mainSeedEventId,
  seedParticipantCount,
} from "../../../prisma/seed";

describe("PrismaSeed", () => {
  it("deve montar eventos fixos para dados de desenvolvimento", () => {
    const events = buildSeedEvents();

    expect(events).toHaveLength(5);
    expect(events[0]).toMatchObject({
      id: mainSeedEventId,
      name: "Evento com 1000 participantes",
    });
  });

  it("deve montar participantes com e-mails unicos e previsiveis", () => {
    const participants = buildSeedParticipants();
    const emails = participants.map((participant) => participant.email);

    expect(participants).toHaveLength(seedParticipantCount);
    expect(new Set(emails).size).toBe(seedParticipantCount);
    expect(emails[0]).toContain("seed0001");
    expect(emails[999]).toContain("seed1000");
  });

  it("deve inscrever todos os participantes no evento principal", () => {
    const participants = buildSeedParticipants();
    const subscriptions = buildSeedSubscriptions(participants);

    expect(subscriptions).toHaveLength(seedParticipantCount);
    expect(subscriptions.every((subscription) => subscription.eventId === mainSeedEventId)).toBe(
      true
    );
    expect(subscriptions[0]?.participantId).toBe(participants[0]?.id);
  });
});
