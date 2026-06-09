import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/layout/BackLink";
import { PageContainer } from "@/components/layout/PageContainer";
import { DateTile } from "@/components/ui/DateTile";
import { Typography } from "@/components/ui/Typography";
import { eventsService } from "@/services/events";
import type { Event, EventParticipant } from "@/types";
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

type EventDetail = {
  event: Event;
  participants: EventParticipant[];
};

async function loadEventDetail(eventId: string): Promise<EventDetail> {
  try {
    const [event, participants] = await Promise.all([
      eventsService.findById(eventId),
      eventsService.listParticipants(eventId, { sort: "createdAt", order: "asc", limit: 100 }),
    ]);

    return { event, participants: participants.data };
  } catch (error) {
    if (extractErrorStatus(error) === 404) {
      notFound();
    }

    throw error;
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const { event, participants } = await loadEventDetail(eventId);

  return (
    <PageContainer className="py-8">
      <BackLink href="/events" label="Eventos" />

      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <DateTile date={event.date} size="lg" />
        <div className="min-w-0">
          <Typography variant="title" className="sm:text-3xl">
            {event.name}
          </Typography>
          <Typography variant="body-muted" className="mt-1.5">
            {AppDate.format(event.date)}
          </Typography>
        </div>
      </header>

      {event.description && (
        <Typography variant="body" className="mt-6 max-w-prose whitespace-pre-line text-pretty">
          {event.description}
        </Typography>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Typography variant="section">Participantes</Typography>
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-strong">
              {participants.length}
            </span>
          </div>
          <ParticipantList participants={participants} />
        </section>

        <aside>
          <div className="rounded-xl border border-border p-5 lg:sticky lg:top-20">
            <Typography variant="subsection">Inscrever participante</Typography>
            <Typography variant="body-muted" className="mb-4 mt-1">
              Adicione alguem a lista deste evento.
            </Typography>
            <SubscribeParticipantForm eventId={eventId} />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
