import { describe, expect, it } from "vitest";

import type { PerformanceResult } from "../../../scripts/performance/event-participants";
import {
  buildSweepConnections,
  buildSweepRows,
  formatSweepSummary,
} from "../../../scripts/performance/event-participants-sweep";

describe("EventParticipantsPerformanceSweep", () => {
  it("deve montar conexoes padrao do sweep", () => {
    const connections = buildSweepConnections({});

    expect(connections).toEqual([2, 5, 10, 25, 50]);
  });

  it("deve montar conexoes customizadas do sweep", () => {
    const connections = buildSweepConnections({
      PERF_SWEEP_CONNECTIONS: "1, 3, 7",
    });

    expect(connections).toEqual([1, 3, 7]);
  });

  it("deve rejeitar conexoes invalidas", () => {
    expect(() => buildSweepConnections({ PERF_SWEEP_CONNECTIONS: "1,zero,3" })).toThrow(
      "PERF_SWEEP_CONNECTIONS deve conter apenas numeros inteiros positivos"
    );
  });

  it("deve formatar tabela com resultados por nivel de carga", () => {
    const result: PerformanceResult = {
      bytesRead: 10000,
      durationSeconds: 10,
      errors: 0,
      latencyAverageMs: 8,
      latencyP95Ms: 18,
      latencyP99Ms: 28,
      non2xx: 0,
      requestsPerSecond: 500,
      totalRequests: 5000,
    };
    const rows = buildSweepRows([
      {
        connections: 10,
        result,
      },
    ]);

    const summary = formatSweepSummary(rows);

    expect(summary).toContain("Conexoes");
    expect(summary).toContain("RPS");
    expect(summary).toContain("10");
    expect(summary).toContain("500");
    expect(summary).toContain("18");
    expect(summary).toContain("28");
  });
});
