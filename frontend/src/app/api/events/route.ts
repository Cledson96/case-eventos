import { NextResponse } from "next/server";

import { eventsService } from "@/services/events";
import type { CreateEventInput } from "@/types";
import { extractErrorMessage, extractErrorStatus } from "@/utils/error";

export async function POST(request: Request) {
  let body: CreateEventInput;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Corpo da requisicao invalido" }, { status: 400 });
  }

  try {
    const event = await eventsService.create(body);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: extractErrorMessage(error) },
      { status: extractErrorStatus(error, 400) }
    );
  }
}
