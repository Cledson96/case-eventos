import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Typography } from "@/components/ui/Typography";
import { buttonPrimary } from "@/components/ui/styles";
import { eventsService } from "@/services/events";
import { EventCard } from "./components/EventCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos",
};

export default async function EventsPage() {
  const { data: events } = await eventsService.list({ sort: "date", order: "asc", limit: 100 });

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
    </PageContainer>
  );
}
