import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { Typography } from "@/components/ui/Typography";
import type { Event } from "@/types";
import { UpcomingEventItem } from "./UpcomingEventItem";

export function UpcomingEvents({ events }: { events: Event[] }) {
  return (
    <section className="mt-16">
      <div className="mb-4 flex items-baseline justify-between">
        <Typography variant="section">Proximos eventos</Typography>
        {events.length > 0 && (
          <Link href="/events" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
            Ver todos
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <EmptyState
          description="Nenhum evento proximo no momento."
          action={{ href: "/events/new", label: "Criar um evento" }}
        />
      ) : (
        <ul className="flex flex-col">
          {events.map((event, index) => (
            <UpcomingEventItem key={event.id} event={event} index={index} />
          ))}
        </ul>
      )}
    </section>
  );
}
