import type { Metadata } from "next";
import Link from "next/link";

import { buttonPrimary } from "@/components/ui/styles";
import { eventsService } from "@/services/events";
import { EmptyState } from "./components/EmptyState";
import { EventCard } from "./components/EventCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos",
};

export default async function EventsPage() {
  const { data: events } = await eventsService.list({ sort: "date", order: "asc", limit: 100 });

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Eventos</h1>
        <Link href="/events/new" className={buttonPrimary}>
          Novo evento
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ul>
      )}
    </main>
  );
}
