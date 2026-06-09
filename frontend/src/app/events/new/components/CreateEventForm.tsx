"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/providers/ToastProvider";
import { DateTile } from "@/components/ui/DateTile";
import { TextField } from "@/components/ui/TextField";
import { Typography } from "@/components/ui/Typography";
import { buttonPrimary, buttonSecondary } from "@/components/ui/styles";
import { AppDate } from "@/utils/date";
import { extractErrorMessage } from "@/utils/error";
import { validateDescription, validateName, validateRequiredDate } from "@/utils/validation";

type Field = "name" | "description" | "date";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string | null>>;

const validators: Record<Field, (value: string) => string | null> = {
  name: validateName,
  description: validateDescription,
  date: validateRequiredDate,
};

const emptyValues: Values = { name: "", description: "", date: "" };

export function CreateEventForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    if (errors[field] !== undefined) {
      setErrors((current) => ({ ...current, [field]: validators[field](value) }));
    }
  }

  function handleBlur(field: Field) {
    setErrors((current) => ({ ...current, [field]: validators[field](values[field]) }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {
      name: validateName(values.name),
      description: validateDescription(values.description),
      date: validateRequiredDate(values.date),
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setSubmitting(true);

    try {
      await axios.post("/api/events", {
        name: values.name.trim(),
        description: values.description.trim(),
        date: values.date,
      });
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
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          id="name"
          label="Nome"
          value={values.name}
          onChange={(value) => handleChange("name", value)}
          onBlur={() => handleBlur("name")}
          error={errors.name}
          required
          maxLength={120}
        />

        <TextField
          id="description"
          label="Descricao"
          multiline
          rows={5}
          value={values.description}
          onChange={(value) => handleChange("description", value)}
          onBlur={() => handleBlur("description")}
          error={errors.description}
          required
        />

        <TextField
          id="date"
          label="Data"
          type="datetime-local"
          value={values.date}
          onChange={(value) => handleChange("date", value)}
          onBlur={() => handleBlur("date")}
          error={errors.date}
          required
        />

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
          <Typography as="p" variant="label" className="mb-2 text-zinc-500">
            Previa
          </Typography>
          <div className="flex gap-4 rounded-xl border border-black/10 p-5 dark:border-white/15">
            {values.date ? (
              <DateTile date={values.date} />
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
              <Typography
                variant="card-title"
                as="p"
                className={`truncate ${values.name ? "" : "text-zinc-400"}`}
              >
                {values.name || "Nome do evento"}
              </Typography>
              <Typography variant="body-muted" as="p" className="mt-1 truncate">
                {values.date ? AppDate.weekdayTime(values.date) : "Selecione a data"}
              </Typography>
              {values.description && (
                <Typography variant="body-sm" as="p" className="mt-1 line-clamp-2">
                  {values.description}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
