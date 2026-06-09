import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/layout/BackLink";
import { PageContainer } from "@/components/layout/PageContainer";
import { DateTile } from "@/components/ui/DateTile";
import { Pagination } from "@/components/ui/Pagination";
import { Typography } from "@/components/ui/Typography";
import { eventsService } from "@/services/events";
import type { Event, EventParticipant, PaginationMeta } from "@/types";
import { AppDate } from "@/utils/date";
import { extractErrorStatus } from "@/utils/error";
import { ParticipantList } from "./components/ParticipantList";
import { SubscribeParticipantForm } from "./components/SubscribeParticipantForm";

export const dynamic = "force-dynamic";

const PARTICIPANTS_PER_PAGE = 10;

export const metadata: Metadata = {
  title: "Detalhes do evento",
};

type EventDetailPageProps = {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ page?: string }>;
};

type EventDetail = {
  event: Event;
  participants: EventParticipant[];
  meta: PaginationMeta;
};

async function loadEventDetail(eventId: string, page: number): Promise<EventDetail> {
  try {
    const [event, participants] = await Promise.all([
      eventsService.findById(eventId),
      eventsService.listParticipants(eventId, {
        page,
        limit: PARTICIPANTS_PER_PAGE,
        sort: "createdAt",
        order: "desc",
      }),
    ]);

    return { event, participants: participants.data, meta: participants.meta };
  } catch (error) {
    if (extractErrorStatus(error) === 404) {
      notFound();
    }

    throw error;
  }
}

export default async function EventDetailPage({ params, searchParams }: EventDetailPageProps) {
  const { eventId } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { event, participants, meta } = await loadEventDetail(eventId, page);

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
        <section id="participantes" className="scroll-mt-20">
          <div className="mb-4 flex items-center gap-2">
            <Typography variant="section">Participantes</Typography>
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-strong">
              {meta.total}
            </span>
          </div>
          <ParticipantList participants={participants} />
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            basePath={`/events/${eventId}`}
            hash="#participantes"
          />
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
