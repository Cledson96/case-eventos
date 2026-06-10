import { EmptyState } from "@/components/ui/EmptyState";
import { Typography } from "@/components/ui/Typography";
import type { EventParticipant } from "@/types";
import { AppDate } from "@/utils/date";
import { ParticipantContactValue } from "./ParticipantContactValue";
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

export function ParticipantList({
  participants,
  search = "",
}: {
  participants: EventParticipant[];
  search?: string;
}) {
  if (participants.length === 0) {
    const hasSearch = search.trim().length > 0;

    return (
      <EmptyState
        description={
          hasSearch ? "Nenhum participante encontrado." : "Nenhum participante inscrito ainda."
        }
        hint={
          hasSearch
            ? "Tente buscar por outro nome, e-mail ou telefone."
            : "Use o formulario para adicionar o primeiro."
        }
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
              <div className="mt-0.5 grid min-w-0 gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                <ParticipantContactValue
                  label={`E-mail de ${participant.name}`}
                  value={participant.email}
                  className="max-w-full sm:max-w-[min(42vw,26rem)]"
                />
                <ParticipantContactValue
                  label={`Telefone de ${participant.name}`}
                  value={participant.phone}
                  className="max-w-full sm:max-w-[16rem]"
                />
              </div>
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
