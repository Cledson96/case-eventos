"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/providers/ToastProvider";
import { extractErrorMessage } from "@/utils/error";

type DeleteParticipantActionProps = {
  participantId: string;
  participantName: string;
};

const baseButton =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export function DeleteParticipantAction({
  participantId,
  participantName,
}: DeleteParticipantActionProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await axios.delete(`/api/participants/${participantId}`);
      showToast("Participante excluido com sucesso");
      router.refresh();
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
      setDeleting(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className={`${baseButton} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20`}
          aria-label={`Confirmar exclusao de ${participantName}`}
        >
          {deleting ? "Excluindo..." : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className={`${baseButton} border border-border hover:border-black/40 dark:hover:border-white/50`}
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={`${baseButton} border border-transparent text-red-700 hover:border-red-200 hover:bg-red-50 dark:text-red-300 dark:hover:border-red-500/30 dark:hover:bg-red-500/10`}
      aria-label={`Excluir ${participantName}`}
    >
      Excluir
    </button>
  );
}
