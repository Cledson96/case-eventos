import { Client } from "pg";

export const defaultDatabaseTestUrl =
  "postgresql://case_eventos:case_eventos@localhost:5432/case_eventos_test?schema=public";

export function resolveDatabaseTestUrl(env: Record<string, string | undefined>): string {
  const databaseTestUrl = env.DATABASE_TEST_URL?.trim();

  return databaseTestUrl || defaultDatabaseTestUrl;
}

export function resolveDatabaseName(connectionString: string): string {
  const url = new URL(connectionString);
  const databaseName = decodeURIComponent(url.pathname.replace(/^\//, ""));

  if (!databaseName) {
    throw new Error("DATABASE_TEST_URL deve informar o database");
  }

  return databaseName;
}

export function resolveMaintenanceDatabaseUrl(connectionString: string): string {
  const url = new URL(connectionString);
  url.pathname = "/postgres";
  url.search = "";

  return url.toString();
}

function quoteIdentifier(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function ensureTestDatabaseExists(connectionString: string): Promise<void> {
  const databaseName = resolveDatabaseName(connectionString);
  const client = new Client({
    connectionString: resolveMaintenanceDatabaseUrl(connectionString),
  });

  await client.connect();

  try {
    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [
      databaseName,
    ]);

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
    }
  } finally {
    await client.end();
  }
}
