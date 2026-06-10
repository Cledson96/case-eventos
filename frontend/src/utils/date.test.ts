import { describe, expect, it } from "vitest";

import { AppDate } from "./date";

describe("AppDate.format", () => {
  it("formata a data em portugues", () => {
    const result = AppDate.format("2026-06-08T12:00:00.000Z");

    expect(result).toMatch(/de junho de 2026/);
  });
});
