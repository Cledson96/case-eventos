import Link from "next/link";

import { DateTile } from "@/components/ui/DateTile";
import type { Event } from "@/types";
import { AppDate } from "@/utils/date";

export function EventCard({ event }: { event: Event }) {
  return (
    <li>
      <Link
        href={`/events/${event.id}`}
        className="group flex h-full gap-4 rounded-xl border border-black/10 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/15 dark:hover:border-brand"
      >
        <DateTile date={event.date} />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="truncate font-medium transition-colors group-hover:text-brand-strong">
            {event.name}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {AppDate.weekdayTime(event.date)}
          </p>
          <p className="line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">
            {event.description}
          </p>
        </div>
      </Link>
    </li>
  );
}
