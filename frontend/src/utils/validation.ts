import { onlyDigits } from "./mask";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Informe o nome";
  }

  if (trimmed.length > 120) {
    return "Maximo de 120 caracteres";
  }

  return null;
}

export function validateDescription(value: string): string | null {
  if (!value.trim()) {
    return "Informe a descricao";
  }

  return null;
}

export function validateRequiredDate(value: string): string | null {
  if (!value) {
    return "Informe a data";
  }

  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Informe o e-mail";
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return "E-mail invalido";
  }

  if (trimmed.length > 180) {
    return "Maximo de 180 caracteres";
  }

  return null;
}

export function validatePhone(value: string): string | null {
  const digits = onlyDigits(value);

  if (!digits) {
    return "Informe o telefone";
  }

  if (digits.length < 10 || digits.length > 11) {
    return "Telefone invalido";
  }

  return null;
}
