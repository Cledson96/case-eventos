import Link from "next/link";

import { buttonPrimary, buttonSecondary } from "@/components/ui/styles";

export function Hero() {
  return (
    <section>
      <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Eventos e participantes, em um so lugar
      </h1>
      <p className="mt-4 max-w-prose text-pretty text-zinc-600 dark:text-zinc-400">
        Cadastre eventos, inscreva participantes e acompanhe quem vai em cada um, do cadastro a
        lista de presenca.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/events" className={buttonPrimary}>
          Ver eventos
        </Link>
        <Link href="/events/new" className={buttonSecondary}>
          Criar evento
        </Link>
      </div>
    </section>
  );
}
