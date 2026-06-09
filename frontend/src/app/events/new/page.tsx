import type { Metadata } from "next";

import { BackLink } from "@/components/layout/BackLink";
import { PageContainer } from "@/components/layout/PageContainer";
import { CreateEventForm } from "./components/CreateEventForm";

export const metadata: Metadata = {
  title: "Novo evento",
};

export default function NewEventPage() {
  return (
    <PageContainer size="md" className="py-8">
      <BackLink href="/events" label="Eventos" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Novo evento</h1>
      <p className="mb-8 mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
        Preencha os dados e acompanhe a previa ao lado.
      </p>
      <CreateEventForm />
    </PageContainer>
  );
}
