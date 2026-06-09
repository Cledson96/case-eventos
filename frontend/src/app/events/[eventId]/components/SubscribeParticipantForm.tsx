"use client";

import axios from "axios";
import { useState } from "react";

import { useToast } from "@/components/providers/ToastProvider";
import { TextField } from "@/components/ui/TextField";
import { buttonPrimary } from "@/components/ui/styles";
import { maskPhone } from "@/utils/mask";
import { extractErrorMessage } from "@/utils/error";
import { validateEmail, validateName, validatePhone } from "@/utils/validation";

type Field = "name" | "email" | "phone";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string | null>>;

const validators: Record<Field, (value: string) => string | null> = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
};

const emptyValues: Values = { name: "", email: "", phone: "" };

export function SubscribeParticipantForm({ eventId }: { eventId: string }) {
  const { showToast } = useToast();
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: Field, raw: string) {
    const value = field === "phone" ? maskPhone(raw) : raw;
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
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`/api/events/${eventId}/participants`, {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone,
      });
      showToast("Participante inscrito com sucesso");
      setValues(emptyValues);
      setErrors({});
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
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
        autoComplete="name"
      />

      <TextField
        id="email"
        label="E-mail"
        type="email"
        inputMode="email"
        value={values.email}
        onChange={(value) => handleChange("email", value)}
        onBlur={() => handleBlur("email")}
        error={errors.email}
        required
        maxLength={180}
        autoComplete="email"
        placeholder="nome@exemplo.com"
      />

      <TextField
        id="phone"
        label="Telefone"
        type="tel"
        inputMode="tel"
        value={values.phone}
        onChange={(value) => handleChange("phone", value)}
        onBlur={() => handleBlur("phone")}
        error={errors.phone}
        required
        autoComplete="tel"
        placeholder="(11) 90000-0000"
      />

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className={buttonPrimary}>
          {submitting ? "Inscrevendo..." : "Inscrever participante"}
        </button>
      </div>
    </form>
  );
}
