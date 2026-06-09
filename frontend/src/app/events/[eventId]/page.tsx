import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DateTile } from "@/components/ui/DateTile";
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
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Eventos
      </Link>

      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <DateTile date={event.date} size="lg" />
        <div className="min-w-0">
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {event.name}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            {AppDate.format(event.date)}
          </p>
        </div>
      </header>

      {event.description && (
        <p className="mt-6 max-w-prose whitespace-pre-line text-pretty text-zinc-700 dark:text-zinc-300">
          {event.description}
        </p>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold">Participantes</h2>
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-strong">
              {participants.length}
            </span>
          </div>
          <ParticipantList participants={participants} />
        </section>

        <aside>
          <div className="rounded-xl border border-black/10 p-5 lg:sticky lg:top-20 dark:border-white/15">
            <h2 className="text-base font-semibold">Inscrever participante</h2>
            <p className="mb-4 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Adicione alguem a lista deste evento.
            </p>
            <SubscribeParticipantForm eventId={eventId} />
          </div>
        </aside>
      </div>
    </main>
  );
}
