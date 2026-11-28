import {createCache} from "cache-manager";
import {Keyv, type KeyvStoreAdapter} from "keyv";
import IORedisMock from "ioredis-mock";
import type {Redis as IORedis} from "ioredis";

// @types/ioredis-mock doesn't type the default export as a constructor
const Redis = IORedisMock as unknown as new (options?: Record<string, unknown>) => IORedis;
import {IORedisKeyvAdapter} from "./IORedisKeyvAdapter.js";

describe("IORedisKeyvAdapter", () => {
  describe("with a Redis connection", () => {
    let client: IORedis;
    let adapter: IORedisKeyvAdapter;

    beforeEach(async () => {
      client = new Redis();
      await client.flushall();
      adapter = new IORedisKeyvAdapter(client);
    });

    it("should be a Keyv store adapter", () => {
      const store: KeyvStoreAdapter = adapter;

      expect(store.opts).toEqual({dialect: "redis"});
      expect(adapter.client).toBe(client);
    });

    it("should set and get values", async () => {
      expect(await adapter.set("key", "value")).toBe(true);
      expect(await adapter.get("key")).toEqual("value");
      expect(await adapter.get("unknown")).toBeUndefined();
      expect(await client.pttl("key")).toEqual(-1);
    });

    it("should set the ttl in milliseconds", async () => {
      await adapter.set("key", "value", 1500);

      const pttl = await client.pttl("key");

      expect(pttl).toBeGreaterThan(1000);
      expect(pttl).toBeLessThanOrEqual(1500);
    });

    it("should handle many keys", async () => {
      await adapter.setMany([
        {key: "a", value: "1", ttl: 1000},
        {key: "b", value: "2"}
      ]);

      expect(await adapter.getMany(["a", "b", "c"])).toEqual(["1", "2", undefined]);
      expect(await adapter.getMany([])).toEqual([]);
      expect(await adapter.has("a")).toBe(true);
      expect(await adapter.deleteMany(["a", "b"])).toBe(true);
      expect(await adapter.deleteMany([])).toBe(false);
      expect(await adapter.has("a")).toBe(false);
      expect(await adapter.delete("a")).toBe(false);
    });

    it("should list keys by pattern", async () => {
      await adapter.set("a:1", "1");
      await adapter.set("a:2", "2");
      await adapter.set("b:1", "3");

      expect((await adapter.keys()).sort()).toEqual(["a:1", "a:2", "b:1"]);
      expect((await adapter.keys("a:*")).sort()).toEqual(["a:1", "a:2"]);
    });

    it("should flush the database on clear without namespace", async () => {
      await adapter.set("a", "1");
      await adapter.clear();

      expect(await client.dbsize()).toEqual(0);
    });

    it("should scope keys and clear to the Keyv namespace", async () => {
      await client.set("other", "value");

      const keyv = new Keyv({store: adapter, namespace: "app"});

      await keyv.set("k", "v");

      expect(await client.exists("app:k")).toEqual(1);
      expect(await adapter.keys()).toEqual(["k"]);

      await keyv.clear();

      expect(await client.keys("*")).toEqual(["other"]);
    });

    it("should work with cache-manager v7", async () => {
      const cache = createCache({stores: [new Keyv({store: adapter, useKeyPrefix: false})]});

      await cache.set("key", {a: 1}, 10000);
      await cache.mset([{key: "k1", value: 1}]);

      expect(await cache.get("key")).toEqual({a: 1});
      expect(await cache.mget(["key", "k1", "k2"])).toEqual([{a: 1}, 1, undefined]);
      expect(await client.pttl("key")).toBeGreaterThan(9000);
      expect(await cache.ttl("key")).toBeGreaterThan(Date.now());

      await cache.del("key");

      expect(await cache.get("key")).toBeUndefined();
    });
  });

  describe("with a cluster", () => {
    it("should scan, flush and use single key commands on every master", async () => {
      const masters = [new Redis({port: 7001}), new Redis({port: 7002})];
      await Promise.all(masters.map((node) => node.flushall()));
      const nodeOf = (key: string) => masters[key.length % 2];

      const cluster = {
        isCluster: true,
        nodes: vi.fn(() => masters),
        mget: vi.fn(),
        get: (key: string) => nodeOf(key).get(key),
        set: (key: string, ...args: any[]) => (nodeOf(key).set as any)(key, ...args),
        exists: (key: string) => nodeOf(key).exists(key),
        del: (key: string) => nodeOf(key).del(key)
      };
      const adapter = new IORedisKeyvAdapter(cluster as any);

      await adapter.setMany([
        {key: "a", value: "1"},
        {key: "bb", value: "2"}
      ]);

      expect((await adapter.keys()).sort()).toEqual(["a", "bb"]);
      expect(cluster.nodes).toHaveBeenCalledWith("master");
      expect(await adapter.getMany(["a", "bb"])).toEqual(["1", "2"]);
      expect(cluster.mget).not.toHaveBeenCalled();
      expect(await adapter.deleteMany(["a"])).toBe(true);

      await adapter.set("a", "1");
      await adapter.clear();

      expect(await masters[0].dbsize()).toEqual(0);
      expect(await masters[1].dbsize()).toEqual(0);
    });
  });
});
