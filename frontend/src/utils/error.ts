import axios from "axios";

export function extractErrorMessage(error: unknown, fallback = "Erro inesperado"): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | undefined;

    return typeof payload?.message === "string" ? payload.message : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function extractErrorStatus(error: unknown, fallback = 500): number {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? fallback;
  }

  return fallback;
}
