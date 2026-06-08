import { NextResponse } from "next/server";

import { eventsService } from "@/services/events";
import { participantsService } from "@/services/participants";
import type { CreateParticipantInput, Participant } from "@/types";
import { extractErrorMessage, extractErrorStatus } from "@/utils/error";

type RouteContext = {
  params: Promise<{ eventId: string }>;
};

async function resolveParticipant(input: CreateParticipantInput): Promise<Participant> {
  try {
    return await participantsService.create(input);
  } catch (error) {
    if (extractErrorStatus(error) === 409) {
      const existing = await participantsService.findByEmail(input.email);

      if (existing) {
        return existing;
      }
    }

    throw error;
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const { eventId } = await params;

  let body: CreateParticipantInput;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Corpo da requisicao invalido" }, { status: 400 });
  }

  try {
    const participant = await resolveParticipant(body);
    const subscription = await eventsService.subscribe(eventId, participant.id);

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: extractErrorMessage(error) },
      { status: extractErrorStatus(error, 400) }
    );
  }
}
