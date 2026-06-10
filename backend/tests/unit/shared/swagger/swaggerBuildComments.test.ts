import { readFileSync } from "node:fs";
import { join } from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

const docs = [
  {
    file: "src/modules/events/docs/index.ts",
    paths: ["/events:", "/events/{eventId}:", "/events/{eventId}/participants:"],
  },
  {
    file: "src/modules/participants/docs/index.ts",
    paths: ["/participants:", "/participants/{participantId}:"],
  },
];

function transpileDoc(file: string): string {
  const source = readFileSync(join(process.cwd(), file), "utf8");

  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2023,
      removeComments: false,
    },
  }).outputText;
}

describe("Swagger build comments", () => {
  it.each(docs)("deve preservar os paths de $file no build", ({ file, paths }) => {
    const output = transpileDoc(file);

    for (const path of paths) {
      expect(output).toContain(path);
    }
  });
});
