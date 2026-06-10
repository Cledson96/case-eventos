import "server-only";

import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

import { getApiConfig } from "@/config/env";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
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

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client().delete<ApiEnvelope<T>>(url, config);

    return response.data.data;
  }
}

export const httpClient = new HttpClient();
