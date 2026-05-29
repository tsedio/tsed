import {catchAsyncError} from "@tsed/core";
import {type Cache, caching} from "cache-manager";

import {RedisStore, redisStore} from "./RedisStore.js";

vi.mock("redis", () => {
  const createCacheClient = () => {
    const cache = new Map<string, any>();

    return {
      cache,
      connect: vi.fn(() => Promise.resolve()),
      disconnect: vi.fn(() => Promise.resolve()),
      set: vi.fn((key: string, value: any) => {
        cache.set(key, {value, ttl: -1});
        return Promise.resolve("OK");
      }),
      setEx: vi.fn((key: string, ttl: number, value: any) => {
        cache.set(key, {value, ttl});
        return Promise.resolve("OK");
      }),
      get: vi.fn((key: string) => Promise.resolve(cache.get(key)?.value)),
      mSet: vi.fn((entries: Record<string, string>) => {
        Object.entries(entries).forEach(([key, value]) => cache.set(key, {value, ttl: -1}));
        return Promise.resolve("OK");
      }),
      mGet: vi.fn((keys: string[]) => Promise.resolve(keys.map((key) => cache.get(key)?.value))),
      del: vi.fn((...keys: string[]) => {
        keys.forEach((key) => cache.delete(key));
        return Promise.resolve(1);
      }),
      flushAll: vi.fn(() => {
        cache.clear();
        return Promise.resolve("OK");
      }),
      keys: vi.fn(() => Promise.resolve([...cache.keys()])),
      ttl: vi.fn((key: string) => Promise.resolve(cache.get(key)?.ttl || -1)),
      multi: vi.fn(function () {
        const client = this as any;
        return {
          setEx: (key: string, ttl: number, value: string) => {
            client.cache.set(key, {value, ttl});
            return this;
          },
          exec: () => Promise.resolve([])
        };
      })
    };
  };

  return {
    createClient: vi.fn(() => createCacheClient()),
    createCluster: vi.fn(() => createCacheClient())
  };
});

let redisCache: Cache<RedisStore>;

describe("RedisStore", () => {
  beforeEach(async () => {
    redisCache = await caching(redisStore, {
      socket: {host: "127.0.0.1", port: 6379},
      ttl: 5
    });

    await redisCache.reset();
  });

  afterEach(async () => {
    await redisCache.store.client.disconnect();
  });

  it("should create redis store", () => {
    const store = new RedisStore({
      socket: {host: "127.0.0.1", port: 6379},
      ttl: 5
    });

    expect(store.getClient()).toBeDefined();
  });

  it("should set/get value", async () => {
    await redisCache.set("foo", "bar");
    expect(await redisCache.get("foo")).toEqual("bar");
  });

  it("should reject non cacheable value", async () => {
    const error = await catchAsyncError(() => redisCache.set("foo", null));
    expect(error?.message).toEqual('"null" is not a cacheable value');
  });

  it("should mset/mget values", async () => {
    await redisCache.store.mset([["foo", "bar"]], 300);
    expect(await redisCache.store.mget("foo")).toEqual(["bar"]);
  });
});
