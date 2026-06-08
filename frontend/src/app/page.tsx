import dayjs from "dayjs";

import { eventsService } from "@/services/events";
import type { Event } from "@/types";
import { Hero } from "./_home/Hero";
import { UpcomingEvents } from "./_home/UpcomingEvents";

export const dynamic = "force-dynamic";

async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const { data } = await eventsService.list({ sort: "date", order: "asc", limit: 50 });
    const now = dayjs();

    return data.filter((event) => dayjs(event.date).isAfter(now)).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Home() {
  const upcoming = await getUpcomingEvents();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 sm:py-24">
      <Hero />
      <UpcomingEvents events={upcoming} />
    </main>
  );
}
