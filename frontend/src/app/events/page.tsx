import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Typography } from "@/components/ui/Typography";
import { buttonPrimary } from "@/components/ui/styles";
import { eventsService } from "@/services/events";
import { EventCard } from "./components/EventCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos",
};

const EVENTS_PER_PAGE = 12;

type EventsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { data: events, meta } = await eventsService.list({
    page,
    limit: EVENTS_PER_PAGE,
    sort: "date",
    order: "asc",
  });

  return (
    <PageContainer className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="title">Eventos</Typography>
        <Link href="/events/new" className={buttonPrimary}>
          Novo evento
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          description="Nenhum evento cadastrado ainda."
          action={{ href: "/events/new", label: "Criar o primeiro evento" }}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={meta.totalPages}
        basePath="/events"
        ariaLabel="Paginacao de eventos"
      />
    </PageContainer>
  );
}
