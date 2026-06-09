-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt");

-- CreateIndex
CREATE INDEX "EventParticipant_eventId_createdAt_idx" ON "EventParticipant"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "Participant_createdAt_idx" ON "Participant"("createdAt");
