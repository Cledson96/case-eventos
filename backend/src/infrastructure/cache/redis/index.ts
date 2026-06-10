import Redis from "ioredis";

import { Env } from "@/shared/config";
import { Logger } from "@/shared/utils";

type CacheClient = {
  connect(): Promise<void>;
  quit(): Promise<unknown>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode: "EX", ttl: number): Promise<unknown>;
  scan(
    cursor: string,
    matchCommand: "MATCH",
    pattern: string,
    countCommand: "COUNT",
    count: number
  ): Promise<[string, string[]]>;
  del(...keys: string[]): Promise<number>;
};

type RedisCacheOptions = {
  redisUrl: string | undefined;
  ttlSeconds: number;
  scanCount?: number;
  deleteBatchSize?: number;
  clientFactory?: () => CacheClient;
};

const DEFAULT_SCAN_COUNT = 100;
const DEFAULT_DELETE_BATCH_SIZE = 100;

export class RedisCache {
  private readonly redisUrl: string | undefined;
  private readonly ttlSeconds: number;
  private readonly scanCount: number;
  private readonly deleteBatchSize: number;
  private readonly clientFactory: () => CacheClient;
  private client: CacheClient | null = null;
  private enabled = false;

  public constructor(options: RedisCacheOptions) {
    this.redisUrl = options.redisUrl;
    this.ttlSeconds = options.ttlSeconds;
    this.scanCount = Math.max(1, options.scanCount ?? DEFAULT_SCAN_COUNT);
    this.deleteBatchSize = Math.max(1, options.deleteBatchSize ?? DEFAULT_DELETE_BATCH_SIZE);
    this.clientFactory =
      options.clientFactory ??
      (() =>
        new Redis(options.redisUrl ?? "", {
          lazyConnect: true,
          connectTimeout: 1000,
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
        }));
  }

  public async connect(): Promise<void> {
    if (!this.redisUrl) {
      this.enabled = false;
      Logger.warn("Cache Redis desabilitado por ausencia de REDIS_URL");
      return;
    }

    try {
      this.client = this.clientFactory();
      await this.client.connect();
      this.enabled = true;
      Logger.info("Cache Redis conectado com sucesso");
    } catch (error) {
      this.client = null;
      this.enabled = false;
      Logger.warn("Cache Redis indisponivel, seguindo sem cache", { error });
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.client) {
      this.enabled = false;
      return;
    }

    try {
      await this.client.quit();
    } catch (error) {
      Logger.warn("Erro ao encerrar conexao com Redis", { error });
    } finally {
      this.client = null;
      this.enabled = false;
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public async get<TValue>(key: string): Promise<TValue | null> {
    if (!this.enabled || !this.client) {
      return null;
    }

    try {
      const cachedValue = await this.client.get(key);

      if (!cachedValue) {
        return null;
      }

      return JSON.parse(cachedValue);
    } catch (error) {
      Logger.warn("Erro ao recuperar valor do cache", { key, error });
      return null;
    }
  }

  public async set<TValue>(key: string, value: TValue): Promise<void> {
    if (!this.enabled || !this.client) {
      return;
    }

    try {
      await this.client.set(key, JSON.stringify(value), "EX", this.ttlSeconds);
    } catch (error) {
      Logger.warn("Erro ao salvar valor no cache", { key, error });
    }
  }

  public async invalidateByPrefix(prefix: string): Promise<void> {
    if (!this.enabled || !this.client) {
      return;
    }

    try {
      let cursor = "0";

      do {
        const [nextCursor, keys] = await this.client.scan(
          cursor,
          "MATCH",
          `${prefix}*`,
          "COUNT",
          this.scanCount
        );

        await this.deleteKeys(this.client, keys);
        cursor = nextCursor;
      } while (cursor !== "0");
    } catch (error) {
      Logger.warn("Erro ao invalidar cache por prefixo", { prefix, error });
    }
  }

  private async deleteKeys(client: CacheClient, keys: string[]): Promise<void> {
    for (let index = 0; index < keys.length; index += this.deleteBatchSize) {
      const batch = keys.slice(index, index + this.deleteBatchSize);

      if (batch.length > 0) {
        await client.del(...batch);
      }
    }
  }
}

export const cache = new RedisCache({
  redisUrl: Env.redisUrl,
  ttlSeconds: Env.cacheTtlSeconds,
});
