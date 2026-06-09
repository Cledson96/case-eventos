import { spawn } from "node:child_process";
import { resolve } from "node:path";
import process from "node:process";

import { ensureTestDatabaseExists, resolveDatabaseTestUrl } from "./test-database-url";

const databaseTestUrl = resolveDatabaseTestUrl(process.env);

const commandEnv = {
  ...process.env,
  NODE_ENV: "test",
  API_TOKEN: process.env.API_TOKEN ?? "case-eventos-test-token",
  DATABASE_URL: databaseTestUrl,
  REDIS_URL: process.env.REDIS_URL ?? "",
  CACHE_TTL_SECONDS: process.env.CACHE_TTL_SECONDS ?? "60",
};

function resolveBinary(binary: string): string {
  const extension = process.platform === "win32" ? ".cmd" : "";

  return resolve("node_modules", ".bin", `${binary}${extension}`);
}

function quoteWindowsArg(value: string): string {
  if (!/\s/.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
}

function resolveCommand(binary: string, args: string[]): { command: string; args: string[] } {
  const resolvedBinary = resolveBinary(binary);

  if (process.platform !== "win32") {
    return {
      command: resolvedBinary,
      args,
    };
  }

  return {
    command: process.env.ComSpec ?? "cmd.exe",
    args: ["/d", "/c", [resolvedBinary, ...args].map(quoteWindowsArg).join(" ")],
  };
}

async function run(binary: string, args: string[]): Promise<void> {
  await new Promise<void>((resolvePromise, rejectPromise) => {
    const command = resolveCommand(binary, args);
    const child = spawn(command.command, command.args, {
      env: commandEnv,
      shell: false,
      stdio: "inherit",
    });

    child.on("error", rejectPromise);
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      rejectPromise(new Error(`${binary} encerrou com codigo ${code}`));
    });
  });
}

try {
  await ensureTestDatabaseExists(databaseTestUrl);
  await run("prisma", ["migrate", "deploy"]);
  await run("vitest", ["run", "--config", "vitest.database.config.ts"]);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
}
