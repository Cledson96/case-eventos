import Link from "next/link";

import { DateTile } from "@/components/ui/DateTile";
import { Typography } from "@/components/ui/Typography";
import type { Event } from "@/types";
import { AppDate } from "@/utils/date";

export function EventCard({ event }: { event: Event }) {
  return (
    <li>
      <Link
        href={`/events/${event.id}`}
        className="group flex h-full gap-4 rounded-xl border border-border p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <DateTile date={event.date} />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Typography
            variant="card-title"
            className="truncate transition-colors group-hover:text-brand-strong"
          >
            {event.name}
          </Typography>
          <Typography variant="body-muted">{AppDate.weekdayTime(event.date)}</Typography>
          <Typography variant="body-sm" className="line-clamp-2">
            {event.description}
          </Typography>
        </div>
      </Link>
    </li>
  );
}
