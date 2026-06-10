import Link from "next/link";

import {
  fieldControlClass,
  fieldLabel,
  buttonPrimary,
  buttonSecondary,
} from "@/components/ui/styles";
import { Typography } from "@/components/ui/Typography";

type ParticipantSearchProps = {
  eventId: string;
  search: string;
};

export function ParticipantSearch({ eventId, search }: ParticipantSearchProps) {
  const hasSearch = search.trim().length > 0;
  const clearHref = `/events/${eventId}#participantes`;

  return (
    <form
      action={clearHref}
      role="search"
      aria-label="Buscar participantes do evento"
      className="mb-5 rounded-lg border border-border p-4"
    >
      <label htmlFor="participant-search" className={fieldLabel}>
        Buscar participantes
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="participant-search"
          name="search"
          type="search"
          defaultValue={search}
          placeholder="Nome, e-mail ou telefone"
          className={`${fieldControlClass(false)} mt-0`}
        />
        <div className="flex shrink-0 gap-2">
          <button type="submit" className={buttonPrimary}>
            Filtrar participantes
          </button>
          {hasSearch ? (
            <Link href={clearHref} className={buttonSecondary}>
              Limpar busca
            </Link>
          ) : null}
        </div>
      </div>
      <Typography variant="caption" as="p" className="mt-2">
        Filtre por nome, e-mail ou telefone.
      </Typography>
    </form>
  );
}
