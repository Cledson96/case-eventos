import { EmptyState } from "@/components/ui/EmptyState";
import { Typography } from "@/components/ui/Typography";
import type { EventParticipant } from "@/types";
import { AppDate } from "@/utils/date";
import { DeleteParticipantAction } from "./DeleteParticipantAction";

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
      <EmptyState
        description="Nenhum participante inscrito ainda."
        hint="Use o formulario para adicionar o primeiro."
      />
    );
  }

  return (
    <ul className="divide-y divide-border">
      {participants.map((participant) => (
        <li key={participant.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
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
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
            <Typography variant="caption" className="shrink-0">
              {AppDate.shortDate(participant.registeredAt)}
            </Typography>
            <DeleteParticipantAction
              participantId={participant.id}
              participantName={participant.name}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
