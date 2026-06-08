import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { eventsService } from "@/services/events";
import type { Event } from "@/types";
import { AppDate } from "@/utils/date";
import { extractErrorStatus } from "@/utils/error";
import { ParticipantList } from "./components/ParticipantList";
import { SubscribeParticipantForm } from "./components/SubscribeParticipantForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detalhes do evento",
};

type EventDetailPageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;

  let event: Event;

  try {
    event = await eventsService.findById(eventId);
  } catch (error) {
    if (extractErrorStatus(error) === 404) {
      notFound();
    }

    throw error;
  }

  const { data: participants } = await eventsService.listParticipants(eventId, {
    sort: "createdAt",
    order: "asc",
    limit: 100,
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <Link href="/events" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
        Voltar para eventos
      </Link>

      <header className="mb-6 mt-4">
        <h1 className="text-2xl font-semibold">{event.name}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {AppDate.format(event.date)}
        </p>
      </header>

      <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300">{event.description}</p>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Inscrever participante</h2>
        <SubscribeParticipantForm eventId={eventId} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Participantes</h2>
        <ParticipantList participants={participants} />
      </section>
    </main>
  );
}
