import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

import {
  buildEventParticipantsUrl,
  buildPerformanceConfig,
  formatPerformanceSummary,
  runPerformanceTest,
  type PerformanceConfig,
  type PerformanceResult,
} from "./event-participants";

export type SweepResult = {
  connections: number;
  result: PerformanceResult;
};

export type SweepRow = {
  connections: string;
  errors: string;
  latencyAverageMs: string;
  latencyP95Ms: string;
  latencyP99Ms: string;
  non2xx: string;
  requestsPerSecond: string;
  totalRequests: string;
};

export function buildSweepConnections(env: NodeJS.ProcessEnv = process.env): number[] {
  const rawConnections = env.PERF_SWEEP_CONNECTIONS?.trim();

  if (!rawConnections) {
    return [2, 5, 10, 25, 50];
  }

  const connections = rawConnections
    .split(",")
    .map((connection) => Number.parseInt(connection.trim(), 10));
  const hasInvalidConnection = connections.some(
    (connection) => !Number.isInteger(connection) || connection <= 0
  );

  if (hasInvalidConnection || connections.length === 0) {
    throw new Error("PERF_SWEEP_CONNECTIONS deve conter apenas numeros inteiros positivos");
  }

  return connections;
}

export async function runPerformanceSweep(
  config: PerformanceConfig,
  connections: number[]
): Promise<SweepResult[]> {
  const results: SweepResult[] = [];

  for (const connectionCount of connections) {
    const result = await runPerformanceTest({
      ...config,
      connections: connectionCount,
    });

    results.push({
      connections: connectionCount,
      result,
    });
  }

  return results;
}

export function buildSweepRows(results: SweepResult[]): SweepRow[] {
  return results.map(({ connections, result }) => ({
    connections: String(connections),
    errors: String(result.errors),
    latencyAverageMs: formatNumber(result.latencyAverageMs),
    latencyP95Ms: formatNumber(result.latencyP95Ms),
    latencyP99Ms: formatNumber(result.latencyP99Ms),
    non2xx: String(result.non2xx),
    requestsPerSecond: formatNumber(result.requestsPerSecond),
    totalRequests: String(result.totalRequests),
  }));
}

export function formatSweepSummary(rows: SweepRow[]): string {
  const headers = ["Conexoes", "RPS", "Lat med", "p95", "p99", "Total", "Nao 2xx", "Erros"];
  const tableRows = rows.map((row) => [
    row.connections,
    row.requestsPerSecond,
    row.latencyAverageMs,
    row.latencyP95Ms,
    row.latencyP99Ms,
    row.totalRequests,
    row.non2xx,
    row.errors,
  ]);
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...tableRows.map((row) => row[index]?.length ?? 0))
  );
  const separator = widths.map((width) => "-".repeat(width)).join(" | ");

  return [
    formatTableLine(headers, widths),
    separator,
    ...tableRows.map((row) => formatTableLine(row, widths)),
  ].join("\n");
}

function formatNumber(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function formatTableLine(values: string[], widths: number[]): string {
  return values.map((value, index) => value.padStart(widths[index] ?? value.length)).join(" | ");
}

function resolveEnvFile(): string {
  return (
    process.env.ENV_FILE ?? (process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev")
  );
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
  const connections = buildSweepConnections();
  const results = await runPerformanceSweep(config, connections);
  const rows = buildSweepRows(results);
  const hasFailures = results.some(({ result }) => result.errors > 0 || result.non2xx > 0);

  writeOutput(`Alvo: ${buildEventParticipantsUrl(config)}`);
  writeOutput(`Duracao por carga: ${config.durationSeconds}s | Pipelining: ${config.pipelining}`);
  writeOutput(formatSweepSummary(rows));

  if (results.length > 0) {
    writeOutput("");
    writeOutput("Maior carga testada:");
    writeOutput(formatPerformanceSummary(results[results.length - 1]?.result ?? results[0].result));
  }

  if (hasFailures) {
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
