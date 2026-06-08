import type { EventParticipant } from "@/types";
import { AppDate } from "@/utils/date";

export function ParticipantList({ participants }: { participants: EventParticipant[] }) {
  if (participants.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Nenhum participante inscrito ainda.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-black/10 dark:divide-white/10">
      {participants.map((participant) => (
        <li key={participant.id} className="py-3">
          <p className="font-medium">{participant.name}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {participant.email} - {participant.phone}
          </p>
          <p className="text-xs text-zinc-500">
            Inscrito em {AppDate.format(participant.registeredAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
