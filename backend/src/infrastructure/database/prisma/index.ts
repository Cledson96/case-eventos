import { PrismaPg } from "@prisma/adapter-pg";

import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { Env } from "@/shared/config";
import { Logger } from "@/shared/utils";

class PrismaDatabase {
  private readonly prismaClient: PrismaClient;
  private connected = false;

  public constructor() {
    this.prismaClient = new PrismaClient({
      adapter: new PrismaPg({ connectionString: Env.databaseUrl }),
      log: this.getLogLevels(),
    });
  }

  public get client(): PrismaClient {
    return this.prismaClient;
  }

  public async connect(): Promise<void> {
    await this.prismaClient.$connect();
    this.connected = true;
    Logger.info("Banco de dados conectado com sucesso");
  }

  public async disconnect(): Promise<void> {
    await this.prismaClient.$disconnect();
    this.connected = false;
    Logger.info("Conexao com banco de dados encerrada");
  }

  public isConnected(): boolean {
    return this.connected;
  }

  private getLogLevels(): Prisma.LogLevel[] {
    return Env.nodeEnv === "development" ? ["query", "info", "warn", "error"] : ["warn", "error"];
  }
}

export const database = new PrismaDatabase();
