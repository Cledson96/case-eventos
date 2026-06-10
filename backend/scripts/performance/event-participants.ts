import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

import { mainSeedEventId } from "../../prisma/seed";

export type PerformanceConfig = {
  apiToken: string;
  baseUrl: string;
  connections: number;
  durationSeconds: number;
  eventId: string;
  limit: number;
  order: "asc" | "desc";
  page: number;
  pipelining: number;
  sort: "createdAt" | "name" | "email";
};

export type PerformanceResult = {
  bytesRead: number;
  durationSeconds: number;
  errors: number;
  latencyAverageMs: number;
  latencyP95Ms: number;
  latencyP99Ms: number;
  non2xx: number;
  requestsPerSecond: number;
  totalRequests: number;
};

type RequestSample = {
  bytesRead: number;
  latencyMs: number;
  non2xx: boolean;
  failed: boolean;
};

type Fetcher = typeof fetch;

export function buildPerformanceConfig(env: NodeJS.ProcessEnv = process.env): PerformanceConfig {
  return {
    apiToken: getRequiredEnv(env, "API_TOKEN"),
    baseUrl: getStringEnv(env, "PERF_BASE_URL", "http://localhost:3333"),
    connections: getPositiveIntegerEnv(env, "PERF_CONNECTIONS", 10),
    durationSeconds: getPositiveIntegerEnv(env, "PERF_DURATION_SECONDS", 10),
    eventId: getStringEnv(env, "PERF_EVENT_ID", mainSeedEventId),
    limit: getPositiveIntegerEnv(env, "PERF_LIMIT", 100),
    order: getOrderEnv(env),
    page: getPositiveIntegerEnv(env, "PERF_PAGE", 1),
    pipelining: getPositiveIntegerEnv(env, "PERF_PIPELINING", 1),
    sort: getSortEnv(env),
  };
}

export function buildEventParticipantsUrl(config: PerformanceConfig): string {
  const url = new URL(`/events/${config.eventId}/participants`, config.baseUrl);

  url.searchParams.set("page", String(config.page));
  url.searchParams.set("limit", String(config.limit));
  url.searchParams.set("sort", config.sort);
  url.searchParams.set("order", config.order);

  return url.toString();
}

export function buildRequestHeaders(config: PerformanceConfig): Record<string, string> {
  return {
    Authorization: `Bearer ${config.apiToken}`,
  };
}

export async function runPerformanceTest(
  config: PerformanceConfig,
  fetcher: Fetcher = fetch
): Promise<PerformanceResult> {
  const url = buildEventParticipantsUrl(config);
  const headers = buildRequestHeaders(config);
  const startedAt = performance.now();
  const deadline = startedAt + config.durationSeconds * 1000;

  const workers = Array.from({ length: config.connections }, () =>
    runWorker({ deadline, fetcher, headers, pipelining: config.pipelining, url })
  );
  const samples = (await Promise.all(workers)).flat();
  const finishedAt = performance.now();
  const durationSeconds = Math.max((finishedAt - startedAt) / 1000, 0.001);

  return summarizeSamples(samples, durationSeconds);
}

export function formatPerformanceSummary(result: PerformanceResult): string {
  return [
    "Resultado do teste de performance",
    `Total de requisicoes: ${result.totalRequests}`,
    `RPS medio: ${round(result.requestsPerSecond)}`,
    `Latencia media: ${round(result.latencyAverageMs)} ms`,
    `p95: ${round(result.latencyP95Ms)} ms`,
    `p99: ${round(result.latencyP99Ms)} ms`,
    `Nao 2xx: ${result.non2xx}`,
    `Erros: ${result.errors}`,
    `Bytes lidos: ${result.bytesRead}`,
  ].join("\n");
}

function resolveEnvFile(): string {
  return (
    process.env.ENV_FILE ?? (process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev")
  );
}

function getRequiredEnv(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key]?.trim();

  if (!value) {
    throw new Error(`${key} nao configurada`);
  }

  return value;
}

function getStringEnv(env: NodeJS.ProcessEnv, key: string, defaultValue: string): string {
  return env[key]?.trim() || defaultValue;
}

function getPositiveIntegerEnv(env: NodeJS.ProcessEnv, key: string, defaultValue: number): number {
  const rawValue = env[key];

  if (!rawValue) {
    return defaultValue;
  }

  const value = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} deve ser um numero inteiro positivo`);
  }

  return value;
}

function getOrderEnv(env: NodeJS.ProcessEnv): PerformanceConfig["order"] {
  const order = getStringEnv(env, "PERF_ORDER", "desc");

  if (order === "asc" || order === "desc") {
    return order;
  }

  throw new Error("PERF_ORDER deve ser asc ou desc");
}

function getSortEnv(env: NodeJS.ProcessEnv): PerformanceConfig["sort"] {
  const sort = getStringEnv(env, "PERF_SORT", "createdAt");

  if (sort === "createdAt" || sort === "name" || sort === "email") {
    return sort;
  }

  throw new Error("PERF_SORT deve ser createdAt, name ou email");
}

async function runWorker(input: {
  deadline: number;
  fetcher: Fetcher;
  headers: Record<string, string>;
  pipelining: number;
  url: string;
}): Promise<RequestSample[]> {
  const samples: RequestSample[] = [];

  while (performance.now() < input.deadline) {
    const batch = Array.from({ length: input.pipelining }, () =>
      executeRequest(input.url, input.headers, input.fetcher)
    );
    samples.push(...(await Promise.all(batch)));
  }

  return samples;
}

async function executeRequest(
  url: string,
  headers: Record<string, string>,
  fetcher: Fetcher
): Promise<RequestSample> {
  const startedAt = performance.now();

  try {
    const response = await fetcher(url, { headers });
    const responseText = await response.text();

    return {
      bytesRead: Buffer.byteLength(responseText),
      failed: false,
      latencyMs: performance.now() - startedAt,
      non2xx: response.status < 200 || response.status >= 300,
    };
  } catch {
    return {
      bytesRead: 0,
      failed: true,
      latencyMs: performance.now() - startedAt,
      non2xx: false,
    };
  }
}

function summarizeSamples(samples: RequestSample[], durationSeconds: number): PerformanceResult {
  const totalRequests = samples.length;
  const latencies = samples.map((sample) => sample.latencyMs).sort((left, right) => left - right);
  const latencyTotal = latencies.reduce((total, latency) => total + latency, 0);

  return {
    bytesRead: samples.reduce((total, sample) => total + sample.bytesRead, 0),
    durationSeconds,
    errors: samples.filter((sample) => sample.failed).length,
    latencyAverageMs: totalRequests === 0 ? 0 : latencyTotal / totalRequests,
    latencyP95Ms: percentile(latencies, 95),
    latencyP99Ms: percentile(latencies, 99),
    non2xx: samples.filter((sample) => sample.non2xx).length,
    requestsPerSecond: totalRequests / durationSeconds,
    totalRequests,
  };
}

function percentile(values: number[], percentileValue: number): number {
  if (values.length === 0) {
    return 0;
  }

  const index = Math.ceil((percentileValue / 100) * values.length) - 1;
  const value = values[index] ?? values[values.length - 1];

  return value ?? 0;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function writeOutput(message: string): void {
  process.stdout.write(`${message}\n`);
}

function writeError(error: unknown): void {
  if (error instanceof Error) {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    return;
  }

  process.stderr.write(`${String(error)}\n`);
}

async function main(): Promise<void> {
  dotenv.config({ path: resolveEnvFile(), quiet: true });

  const config = buildPerformanceConfig();
  const result = await runPerformanceTest(config);
  writeOutput(`Alvo: ${buildEventParticipantsUrl(config)}`);
  writeOutput(
    `Conexoes: ${config.connections} | Duracao: ${config.durationSeconds}s | Pipelining: ${config.pipelining}`
  );
  writeOutput(formatPerformanceSummary(result));

  if (result.errors > 0 || result.non2xx > 0) {
    process.exitCode = 1;
  }
}

const invokedFilePath = process.argv[1] ? resolve(process.argv[1]) : "";
const currentFilePath = fileURLToPath(import.meta.url);

if (currentFilePath === invokedFilePath) {
  main().catch((error: unknown) => {
    writeError(error);
    process.exitCode = 1;
  });
}
