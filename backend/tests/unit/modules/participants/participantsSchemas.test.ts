import { describe, expect, it } from "vitest";

import { createParticipantBodySchema } from "@/modules/participants/schemas";

describe("ParticipantsSchemas", () => {
  it("deve retornar mensagens em portugues quando campos obrigatorios faltarem", () => {
    const result = createParticipantBodySchema.safeParse({});

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    const fieldErrors = result.error.flatten().fieldErrors;

    expect(fieldErrors.name).toContain("Nome e obrigatorio");
    expect(fieldErrors.email).toContain("E-mail e obrigatorio");
    expect(fieldErrors.phone).toContain("Telefone e obrigatorio");
  });
});
