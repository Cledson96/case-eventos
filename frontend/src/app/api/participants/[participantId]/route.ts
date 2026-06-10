import { NextResponse } from "next/server";

import { participantsService } from "@/services/participants";
import { extractErrorMessage, extractErrorStatus } from "@/utils/error";

type RouteContext = {
  params: Promise<{ participantId: string }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { participantId } = await params;

  try {
    const participant = await participantsService.delete(participantId);

    return NextResponse.json(participant);
  } catch (error) {
    return NextResponse.json(
      { message: extractErrorMessage(error) },
      { status: extractErrorStatus(error, 400) }
    );
  }
}
