"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { useToast } from "@/components/providers/ToastProvider";
import { buttonPrimary, fieldControl, fieldLabel } from "@/components/ui/styles";
import { extractErrorMessage } from "@/utils/error";

export function SubscribeParticipantForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    };

    setSubmitting(true);

    try {
      await axios.post(`/api/events/${eventId}/participants`, payload);
      showToast("Participante inscrito com sucesso");
      formRef.current?.reset();
      router.refresh();
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <label htmlFor="email" className={fieldLabel}>
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={180}
          className={fieldControl}
        />
      </div>

      <div>
        <label htmlFor="phone" className={fieldLabel}>
          Telefone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          maxLength={30}
          className={fieldControl}
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className={buttonPrimary}>
          {submitting ? "Inscrevendo..." : "Inscrever participante"}
        </button>
      </div>
    </form>
  );
}
