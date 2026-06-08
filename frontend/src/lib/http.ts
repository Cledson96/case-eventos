import "server-only";

import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

import { getApiConfig } from "@/config/env";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

type ApiErrorPayload = {
  message?: string;
};

class HttpClient {
  private instance: AxiosInstance | null = null;

  private client(): AxiosInstance {
    if (this.instance) {
      return this.instance;
    }

    const { apiUrl, apiToken } = getApiConfig();

    this.instance = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    return this.instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client().get<ApiEnvelope<T>>(url, config);

    return response.data.data;
  }

  public async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client().post<ApiEnvelope<T>>(url, body, config);

    return response.data.data;
  }
}

export const httpClient = new HttpClient();

export function getErrorMessage(error: unknown, fallback = "Erro inesperado"): string {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined;

    if (payload?.message) {
      return payload.message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
