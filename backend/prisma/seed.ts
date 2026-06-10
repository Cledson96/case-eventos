import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { fakerPT_BR as faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";

type SeedEvent = {
  id: string;
  name: string;
  description: string;
  date: Date;
};

type SeedParticipant = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type SeedSubscription = {
  eventId: string;
  participantId: string;
};

export const seedParticipantCount = 1000;
export const mainSeedEventId = "11111111-1111-4111-8111-111111111111";

const seedRandomNumber = 20260609;
const seedEventIds = [
  mainSeedEventId,
  "22222222-2222-4222-8222-222222222222",
  "33333333-3333-4333-8333-333333333333",
  "44444444-4444-4444-8444-444444444444",
  "55555555-5555-4555-8555-555555555555",
];

export function buildSeedEvents(): SeedEvent[] {
  return [
    {
      id: seedEventIds[0] ?? mainSeedEventId,
      name: "Evento com 1000 participantes",
      description: "Evento principal para validar paginacao e listagem com alto volume",
      date: new Date("2026-08-10T13:00:00.000Z"),
    },
    {
      id: seedEventIds[1] ?? buildSeedUuid("event", 2),
      name: "Workshop de APIs Node",
      description: "Encontro pratico sobre APIs REST com Node.js e TypeScript",
      date: new Date("2026-08-18T18:00:00.000Z"),
    },
    {
      id: seedEventIds[2] ?? buildSeedUuid("event", 3),
      name: "Meetup PostgreSQL e Prisma",
      description: "Discussao sobre modelagem, migrations e consultas eficientes",
      date: new Date("2026-09-04T22:00:00.000Z"),
    },
    {
      id: seedEventIds[3] ?? buildSeedUuid("event", 4),
      name: "Imersao Front-end React",
      description: "Evento para testar navegacao entre listagem e detalhes",
      date: new Date("2026-09-21T14:00:00.000Z"),
    },
    {
      id: seedEventIds[4] ?? buildSeedUuid("event", 5),
      name: "Conferencia Fullstack",
      description: "Evento completo para demonstracao do case",
      date: new Date("2026-10-12T12:00:00.000Z"),
    },
  ];
}

export function buildSeedParticipants(count = seedParticipantCount): SeedParticipant[] {
  faker.seed(seedRandomNumber);

  return Array.from({ length: count }, (_item, index) => {
    const position = index + 1;
    const emailPrefix = `seed${String(position).padStart(4, "0")}`;
    const email = faker.internet
      .email({
        firstName: emailPrefix,
        lastName: "case-eventos",
        provider: "example.com",
      })
      .toLowerCase();

    return {
      id: buildSeedUuid("participant", position),
      name: faker.person.fullName(),
      email,
      phone: faker.phone.number().slice(0, 30),
    };
  });
}

export function buildSeedSubscriptions(
  participants: SeedParticipant[],
  eventId = mainSeedEventId
): SeedSubscription[] {
  return participants.map((participant) => ({
    eventId,
    participantId: participant.id,
  }));
}

export async function seedDatabase(prisma: PrismaClient): Promise<void> {
  const events = buildSeedEvents();
  const participants = buildSeedParticipants();
  const subscriptions = buildSeedSubscriptions(participants);

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {
        name: event.name,
        description: event.description,
        date: event.date,
      },
      create: event,
      select: {
        id: true,
      },
    });
  }

  await prisma.participant.createMany({
    data: participants,
    skipDuplicates: true,
  });

  await prisma.eventParticipant.createMany({
    data: subscriptions,
    skipDuplicates: true,
  });

  const participantTotal = await prisma.participant.count({
    where: {
      email: {
        startsWith: "seed",
        endsWith: "@example.com",
      },
    },
  });
  const mainEventParticipantTotal = await prisma.eventParticipant.count({
    where: {
      eventId: mainSeedEventId,
    },
  });

  writeOutput(`Seed concluido: ${events.length} eventos`);
  writeOutput(`Seed concluido: ${participantTotal} participantes de teste`);
  writeOutput(
    `Seed concluido: ${mainEventParticipantTotal} participantes inscritos no evento principal`
  );
}

function buildSeedUuid(scope: string, index: number): string {
  const hash = createHash("sha256").update(`${scope}:${index}`).digest("hex");
  const variantChars = ["8", "9", "a", "b"];
  const variantIndex = Number.parseInt(hash.slice(16, 18), 16) % variantChars.length;
  const variant = variantChars[variantIndex] ?? "8";

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `4${hash.slice(13, 16)}`,
    `${variant}${hash.slice(17, 20)}`,
    hash.slice(20, 32),
  ].join("-");
}

function resolveEnvFile(): string {
  return (
    process.env.ENV_FILE ?? (process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev")
  );
}

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL nao configurada");
  }

  return databaseUrl;
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

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: getDatabaseUrl() }),
  });

  try {
    await seedDatabase(prisma);
  } finally {
    await prisma.$disconnect();
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
