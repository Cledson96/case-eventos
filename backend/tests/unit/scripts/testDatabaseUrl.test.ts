import { describe, expect, it } from "vitest";

import {
  defaultDatabaseTestUrl,
  resolveDatabaseName,
  resolveDatabaseTestUrl,
  resolveMaintenanceDatabaseUrl,
} from "../../../scripts/database/test-database-url";

describe("testDatabaseUrl", () => {
  it("deve usar um banco de testes dedicado por padrao", () => {
    expect(defaultDatabaseTestUrl).toBe(
      "postgresql://case_eventos:case_eventos@localhost:5432/case_eventos_test?schema=public"
    );
    expect(resolveDatabaseTestUrl({})).toBe(defaultDatabaseTestUrl);
  });

  it("deve resolver o database e a url de manutencao", () => {
    const databaseUrl =
      "postgresql://case_eventos:case_eventos@localhost:5432/case_eventos_test?schema=public";

    expect(resolveDatabaseName(databaseUrl)).toBe("case_eventos_test");
    expect(resolveMaintenanceDatabaseUrl(databaseUrl)).toBe(
      "postgresql://case_eventos:case_eventos@localhost:5432/postgres"
    );
  });
});
