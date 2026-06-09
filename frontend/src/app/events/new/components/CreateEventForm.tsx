"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/providers/ToastProvider";
import { TextField } from "@/components/ui/TextField";
import { buttonPrimary, buttonSecondary } from "@/components/ui/styles";
import { useForm } from "@/hooks/useForm";
import { extractErrorMessage } from "@/utils/error";
import { validateDescription, validateName, validateRequiredDate } from "@/utils/validation";
import { EventPreview } from "./EventPreview";

export function CreateEventForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const { values, errors, submitting, setField, handleBlur, handleSubmit } = useForm({
    initialValues: { name: "", description: "", date: "" },
    validators: {
      name: validateName,
      description: validateDescription,
      date: validateRequiredDate,
    },
    onSubmit: async (data) => {
      try {
        await axios.post("/api/events", {
          name: data.name.trim(),
          description: data.description.trim(),
          date: data.date,
        });
        showToast("Evento criado com sucesso");
        router.push("/events");
        router.refresh();
      } catch (error) {
        showToast(extractErrorMessage(error), "error");
      }
    },
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          id="name"
          label="Nome"
          value={values.name}
          onChange={(value) => setField("name", value)}
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
          onChange={(value) => setField("description", value)}
          onBlur={() => handleBlur("description")}
          error={errors.description}
          required
        />

        <TextField
          id="date"
          label="Data"
          type="datetime-local"
          value={values.date}
          onChange={(value) => setField("date", value)}
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
        <EventPreview name={values.name} description={values.description} date={values.date} />
      </aside>
    </div>
  );
}
