import type { Metadata } from "next";
import Link from "next/link";

import { CreateEventForm } from "./components/CreateEventForm";

export const metadata: Metadata = {
  title: "Novo evento",
};

export default function NewEventPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-8">
      <Link href="/events" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
        Voltar para eventos
      </Link>
      <h1 className="mb-6 mt-4 text-2xl font-semibold">Novo evento</h1>
      <CreateEventForm />
    </main>
  );
}
