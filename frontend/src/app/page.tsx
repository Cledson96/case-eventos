import { PageContainer } from "@/components/layout/PageContainer";
import { eventsService } from "@/services/events";
import type { Event } from "@/types";
import { Hero } from "./_home/Hero";
import { UpcomingEvents } from "./_home/UpcomingEvents";

export const dynamic = "force-dynamic";

export default async function Home() {
  let upcoming: Event[] = [];

  try {
    upcoming = await eventsService.listUpcoming(3);
  } catch {
    upcoming = [];
  }

  return (
    <PageContainer size="sm" className="flex flex-1 flex-col py-16 sm:py-24">
      <Hero />
      <UpcomingEvents events={upcoming} />
    </PageContainer>
  );
}
