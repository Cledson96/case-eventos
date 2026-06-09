import Link from "next/link";

import { Typography } from "@/components/ui/Typography";
import { buttonPrimary, buttonSecondary } from "@/components/ui/styles";

export function Hero() {
  return (
    <section>
      <Typography variant="display" className="max-w-xl">
        Eventos e participantes, em um so lugar
      </Typography>
      <Typography variant="lead" className="mt-4 max-w-prose text-pretty">
        Cadastre eventos, inscreva participantes e acompanhe quem vai em cada um, do cadastro a
        lista de presenca.
      </Typography>
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
