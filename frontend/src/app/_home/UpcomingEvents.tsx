import Link from "next/link";

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
        <div className="rounded-lg border border-dashed border-black/15 p-8 text-center dark:border-white/20">
          <Typography variant="body-muted">Nenhum evento proximo no momento.</Typography>
          <Link
            href="/events/new"
            className="mt-3 inline-block text-sm font-medium hover:underline"
          >
            Criar um evento
          </Link>
        </div>
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
