import { describe, expect, it } from "vitest";

import { mainSeedEventId } from "../../../prisma/seed";
import {
  buildEventParticipantsUrl,
  buildPerformanceConfig,
  buildRequestHeaders,
  formatPerformanceSummary,
  type PerformanceResult,
} from "../../../scripts/performance/event-participants";

describe("EventParticipantsPerformance", () => {
  it("deve montar configuracao padrao para o evento seedado", () => {
    const config = buildPerformanceConfig({
      API_TOKEN: "case-eventos-dev-token",
    });

    expect(config).toEqual({
      apiToken: "case-eventos-dev-token",
      baseUrl: "http://localhost:3333",
      connections: 10,
      durationSeconds: 10,
      eventId: mainSeedEventId,
      limit: 100,
      order: "desc",
      page: 1,
      pipelining: 1,
      sort: "createdAt",
    });
  });

  it("deve montar url e headers de autenticacao", () => {
    const config = buildPerformanceConfig({
      API_TOKEN: "token-local",
      PERF_BASE_URL: "http://localhost:3337",
      PERF_CONNECTIONS: "5",
      PERF_DURATION_SECONDS: "3",
      PERF_EVENT_ID: "22222222-2222-4222-8222-222222222222",
      PERF_LIMIT: "50",
      PERF_PAGE: "2",
      PERF_PIPELINING: "2",
    });

    const url = buildEventParticipantsUrl(config);
    const headers = buildRequestHeaders(config);

    expect(url).toBe(
      "http://localhost:3337/events/22222222-2222-4222-8222-222222222222/participants?page=2&limit=50&sort=createdAt&order=desc"
    );
    expect(config.connections).toBe(5);
    expect(config.durationSeconds).toBe(3);
    expect(config.pipelining).toBe(2);
    expect(headers).toEqual({
      Authorization: "Bearer token-local",
    });
  });

  it("deve formatar resumo com rps, latencia e respostas nao 2xx", () => {
    const result: PerformanceResult = {
      bytesRead: 5600000,
      durationSeconds: 10,
      errors: 0,
      latencyAverageMs: 8.4,
      latencyP95Ms: 18,
      latencyP99Ms: 24,
      non2xx: 0,
      requestsPerSecond: 1200,
      totalRequests: 12000,
    };

    const summary = formatPerformanceSummary(result);

    expect(summary).toContain("RPS medio: 1200");
    expect(summary).toContain("Latencia media: 8.4 ms");
    expect(summary).toContain("p95: 18 ms");
    expect(summary).toContain("Nao 2xx: 0");
  });
});
