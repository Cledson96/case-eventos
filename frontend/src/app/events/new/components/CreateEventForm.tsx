"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/providers/ToastProvider";
import { buttonPrimary, fieldControl, fieldLabel } from "@/components/ui/styles";
import { extractErrorMessage } from "@/utils/error";

export function CreateEventForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      date: String(formData.get("date") ?? ""),
    };

    setSubmitting(true);

    try {
      await axios.post("/api/events", payload);
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
          className={fieldControl}
        />
      </div>

      <div>
        <label htmlFor="description" className={fieldLabel}>
          Descricao
        </label>
        <textarea id="description" name="description" required rows={4} className={fieldControl} />
      </div>

      <div>
        <label htmlFor="date" className={fieldLabel}>
          Data
        </label>
        <input id="date" name="date" type="datetime-local" required className={fieldControl} />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className={buttonPrimary}>
          {submitting ? "Salvando..." : "Criar evento"}
        </button>
      </div>
    </form>
  );
}
