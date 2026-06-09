"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/providers/ToastProvider";
import { DateTile } from "@/components/ui/DateTile";
import { buttonPrimary, buttonSecondary, fieldControl, fieldLabel } from "@/components/ui/styles";
import { AppDate } from "@/utils/date";
import { extractErrorMessage } from "@/utils/error";

export function CreateEventForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await axios.post("/api/events", { name, description, date });
      showToast("Evento criado com sucesso");
      router.push("/events");
      router.refresh();
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className={fieldLabel}>
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldControl}
          />
        </div>

        <div>
          <label htmlFor="description" className={fieldLabel}>
            Descricao
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={fieldControl}
          />
        </div>

        <div>
          <label htmlFor="date" className={fieldLabel}>
            Data
          </label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={fieldControl}
          />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Link href="/events" className={buttonSecondary}>
            Cancelar
          </Link>
          <button type="submit" disabled={submitting} className={buttonPrimary}>
            {submitting ? "Salvando..." : "Criar evento"}
          </button>
        </div>
      </form>

      <aside>
        <div className="lg:sticky lg:top-20">
          <p className="mb-2 text-sm font-medium text-zinc-500">Previa</p>
          <div className="flex gap-4 rounded-xl border border-black/10 p-5 dark:border-white/15">
            {date ? (
              <DateTile date={date} />
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-black/20 text-zinc-400 dark:border-white/20">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className={`truncate font-medium ${name ? "" : "text-zinc-400"}`}>
                {name || "Nome do evento"}
              </p>
              <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-400">
                {date ? AppDate.weekdayTime(date) : "Selecione a data"}
              </p>
              {description && (
                <p className="mt-1 line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
