import Redis from "ioredis";

import { Env } from "@/shared/config";
import { Logger } from "@/shared/utils";

type CacheClient = {
  connect(): Promise<void>;
  quit(): Promise<unknown>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode: "EX", ttl: number): Promise<unknown>;
  keys(pattern: string): Promise<string[]>;
  del(...keys: string[]): Promise<number>;
};

type RedisCacheOptions = {
  redisUrl: string | undefined;
  ttlSeconds: number;
  clientFactory?: () => CacheClient;
};

export class RedisCache {
  private readonly redisUrl: string | undefined;
  private readonly ttlSeconds: number;
  private readonly clientFactory: () => CacheClient;
  private client: CacheClient | null = null;
  private enabled = false;

  public constructor(options: RedisCacheOptions) {
    this.redisUrl = options.redisUrl;
    this.ttlSeconds = options.ttlSeconds;
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
      const keys = await this.client.keys(`${prefix}*`);

      if (keys.length === 0) {
        return;
      }

      await this.client.del(...keys);
    } catch (error) {
      Logger.warn("Erro ao invalidar cache por prefixo", { prefix, error });
    }
  }
}

export const cache = new RedisCache({
  redisUrl: Env.redisUrl,
  ttlSeconds: Env.cacheTtlSeconds,
});
