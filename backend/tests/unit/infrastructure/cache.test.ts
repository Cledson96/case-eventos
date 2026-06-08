import { beforeEach, describe, expect, it, vi } from "vitest";

import { RedisCache } from "@/infrastructure/cache/redis";

type StoredValue = {
  value: string;
  mode: "EX";
  ttl: number;
};

class FakeRedisClient {
  public readonly values = new Map<string, StoredValue>();
  public connected = false;

  public async connect(): Promise<void> {
    this.connected = true;
  }

  public async quit(): Promise<void> {
    this.connected = false;
  }

  public async get(key: string): Promise<string | null> {
    return this.values.get(key)?.value ?? null;
  }

  public async set(key: string, value: string, mode: "EX", ttl: number): Promise<"OK"> {
    this.values.set(key, { value, mode, ttl });
    return "OK";
  }

  public async keys(pattern: string): Promise<string[]> {
    const prefix = pattern.replace("*", "");
    return [...this.values.keys()].filter((key) => key.startsWith(prefix));
  }

  public async del(...keys: string[]): Promise<number> {
    let total = 0;

    for (const key of keys) {
      if (this.values.delete(key)) {
        total += 1;
      }
    }

    return total;
  }
}

describe("RedisCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve permanecer desabilitado quando nao houver url do Redis", async () => {
    const cache = new RedisCache({
      redisUrl: undefined,
      ttlSeconds: 60,
    });

    await cache.connect();

    expect(cache.isEnabled()).toBe(false);
    await expect(cache.get<{ id: string }>("events:list")).resolves.toBeNull();
  });

  it("deve salvar e recuperar JSON quando estiver habilitado", async () => {
    const client = new FakeRedisClient();
    const cache = new RedisCache({
      redisUrl: "redis://localhost:6379",
      ttlSeconds: 60,
      clientFactory: () => client,
    });

    await cache.connect();
    await cache.set("events:list", { id: "event-id" });

    await expect(cache.get<{ id: string }>("events:list")).resolves.toEqual({ id: "event-id" });
    expect(client.values.get("events:list")?.ttl).toBe(60);
  });

  it("deve invalidar chaves pelo prefixo informado", async () => {
    const client = new FakeRedisClient();
    const cache = new RedisCache({
      redisUrl: "redis://localhost:6379",
      ttlSeconds: 60,
      clientFactory: () => client,
    });

    await cache.connect();
    await cache.set("events:list:1", { id: "event-1" });
    await cache.set("events:detail:1", { id: "event-1" });
    await cache.set("participants:list:1", { id: "participant-1" });
    await cache.invalidateByPrefix("events:");

    expect(await cache.get("events:list:1")).toBeNull();
    expect(await cache.get("events:detail:1")).toBeNull();
    expect(await cache.get("participants:list:1")).toEqual({ id: "participant-1" });
  });

  it("deve ignorar falhas do Redis e manter a aplicacao funcional", async () => {
    const cache = new RedisCache({
      redisUrl: "redis://localhost:6379",
      ttlSeconds: 60,
      clientFactory: () => ({
        connect: vi.fn().mockRejectedValue(new Error("redis offline")),
        quit: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
        keys: vi.fn(),
        del: vi.fn(),
      }),
    });

    await cache.connect();

    expect(cache.isEnabled()).toBe(false);
    await expect(cache.set("events:list", { ok: true })).resolves.toBeUndefined();
  });
});
