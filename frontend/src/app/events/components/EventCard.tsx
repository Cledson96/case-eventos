import Link from "next/link";

import type { Event } from "@/types";
import { AppDate } from "@/utils/date";

export function EventCard({ event }: { event: Event }) {
  return (
    <li className="rounded-lg border border-black/10 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40">
      <Link href={`/events/${event.id}`} className="flex h-full flex-col gap-2 p-5">
        <h2 className="font-medium">{event.name}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{AppDate.format(event.date)}</p>
        <p className="line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">{event.description}</p>
      </Link>
    </li>
  );
}
