import { Typography } from "@/components/ui/Typography";
import type { EventParticipant } from "@/types";
import { AppDate } from "@/utils/date";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (first + last).toUpperCase();
}

export function ParticipantList({ participants }: { participants: EventParticipant[] }) {
  if (participants.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/15 p-8 text-center dark:border-white/20">
        <Typography variant="body-muted">Nenhum participante inscrito ainda.</Typography>
        <Typography variant="body-muted" className="mt-1">
          Use o formulario para adicionar o primeiro.
        </Typography>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-black/10 dark:divide-white/10">
      {participants.map((participant) => (
        <li key={participant.id} className="flex items-center gap-3 py-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand-strong"
            aria-hidden="true"
          >
            {getInitials(participant.name)}
          </div>

          <div className="min-w-0 flex-1">
            <Typography variant="card-title" as="p" className="truncate">
              {participant.name}
            </Typography>
            <Typography variant="body-muted" as="p" className="truncate">
              {participant.email} · {participant.phone}
            </Typography>
          </div>

          <Typography variant="caption" className="hidden shrink-0 sm:block">
            {AppDate.shortDate(participant.registeredAt)}
          </Typography>
        </li>
      ))}
    </ul>
  );
}
