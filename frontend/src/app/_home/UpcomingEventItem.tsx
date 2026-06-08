import Link from "next/link";

import type { Event } from "@/types";
import { AppDate } from "@/utils/date";

export function UpcomingEventItem({ event, index }: { event: Event; index: number }) {
  return (
    <li
      className="animate-reveal border-b border-black/10 last:border-0 dark:border-white/10"
      style={{ animationDelay: `${0.08 + index * 0.07}s` }}
    >
      <Link
        href={`/events/${event.id}`}
        className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <span className="font-medium sm:min-w-0 sm:truncate">{event.name}</span>
        <span className="shrink-0 text-sm text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100">
          {AppDate.format(event.date)}
        </span>
      </Link>
    </li>
  );
}
