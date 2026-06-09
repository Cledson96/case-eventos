"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/providers/ToastProvider";
import { TextField } from "@/components/ui/TextField";
import { buttonPrimary } from "@/components/ui/styles";
import { useForm } from "@/hooks/useForm";
import { maskPhone } from "@/utils/mask";
import { extractErrorMessage } from "@/utils/error";
import { validateEmail, validateName, validatePhone } from "@/utils/validation";

export function SubscribeParticipantForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { showToast } = useToast();

  const { values, errors, submitting, setField, handleBlur, handleSubmit } = useForm({
    initialValues: { name: "", email: "", phone: "" },
    validators: {
      name: validateName,
      email: validateEmail,
      phone: validatePhone,
    },
    transforms: {
      phone: maskPhone,
    },
    onSubmit: async (data, { reset }) => {
      try {
        await axios.post(`/api/events/${eventId}/participants`, {
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone,
        });
        showToast("Participante inscrito com sucesso");
        reset();
        router.refresh();
      } catch (error) {
        showToast(extractErrorMessage(error), "error");
      }
    },
  });

  return (
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
        autoComplete="name"
      />

      <TextField
        id="email"
        label="E-mail"
        type="email"
        inputMode="email"
        value={values.email}
        onChange={(value) => setField("email", value)}
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
        onChange={(value) => setField("phone", value)}
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
