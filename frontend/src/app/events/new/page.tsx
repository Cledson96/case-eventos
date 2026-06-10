import type { Metadata } from "next";

import { BackLink } from "@/components/layout/BackLink";
import { PageContainer } from "@/components/layout/PageContainer";
import { Typography } from "@/components/ui/Typography";
import { CreateEventForm } from "./components/CreateEventForm";

export const metadata: Metadata = {
  title: "Novo evento",
};

export default function NewEventPage() {
  return (
    <PageContainer size="md" className="py-8">
      <BackLink href="/events" label="Eventos" />
      <Typography variant="title" className="mt-5">
        Novo evento
      </Typography>
      <Typography variant="body-muted" className="mb-8 mt-1.5">
        Preencha os dados e acompanhe a previa ao lado.
      </Typography>
      <CreateEventForm />
    </PageContainer>
  );
}
