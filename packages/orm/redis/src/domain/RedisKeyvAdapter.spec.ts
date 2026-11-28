import {createCache} from "cache-manager";
import {Keyv, type KeyvStoreAdapter} from "keyv";
import {RedisKeyvAdapter} from "./RedisKeyvAdapter.js";

function globToRegExp(pattern: string) {
  return new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);
}

function createFakeClient(db = new Map<string, {value: string; px?: number}>()) {
  return {
    db,
    get: vi.fn(async (key: string) => db.get(key)?.value ?? null),
    mGet: vi.fn(async (keys: string[]) => keys.map((key) => db.get(key)?.value ?? null)),
    set: vi.fn(async (key: string, value: string, options?: {PX?: number}) => {
      db.set(key, {value, px: options?.PX});
      return "OK";
    }),
    exists: vi.fn(async (key: string) => (db.has(key) ? 1 : 0)),
    del: vi.fn(async (keys: string | string[]) => {
      return ([] as string[]).concat(keys).filter((key) => db.delete(key)).length;
    }),
    flushDb: vi.fn(async () => {
      db.clear();
      return "OK";
    }),
    scanIterator: vi.fn(async function* ({MATCH}: {MATCH: string}) {
      const regexp = globToRegExp(MATCH);
      // node-redis v5+ yields batches of keys
      yield [...db.keys()].filter((key) => regexp.test(key));
    })
  };
}

function createFakeCluster() {
  const nodes = [createFakeClient(), createFakeClient()];
  const nodeOf = (key: string) => nodes[key.length % 2];

  return {
    nodes,
    masters: [{id: "1"}, {id: "2"}],
    nodeClient: vi.fn(async (master: {id: string}) => nodes[Number(master.id) - 1]),
    get: vi.fn((key: string) => nodeOf(key).get(key)),
    mGet: vi.fn(),
    set: vi.fn((key: string, value: string, options?: any) => nodeOf(key).set(key, value, options)),
    exists: vi.fn((key: string) => nodeOf(key).exists(key)),
    del: vi.fn((key: string) => nodeOf(key).del(key))
  };
}

describe("RedisKeyvAdapter", () => {
  describe("with a client", () => {
    let client: ReturnType<typeof createFakeClient>;
    let adapter: RedisKeyvAdapter;

    beforeEach(() => {
      client = createFakeClient();
      adapter = new RedisKeyvAdapter(client as any);
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
      expect(client.set).toHaveBeenCalledWith("key", "value");
    });

    it("should set the ttl in milliseconds", async () => {
      await adapter.set("key", "value", 1500);

      expect(client.set).toHaveBeenCalledWith("key", "value", {PX: 1500});
    });

    it("should handle many keys", async () => {
      await adapter.setMany([
        {key: "a", value: "1", ttl: 1000},
        {key: "b", value: "2"}
      ]);

      expect(client.db.get("a")).toEqual({value: "1", px: 1000});
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

      expect(await adapter.keys()).toEqual(["a:1", "a:2", "b:1"]);
      expect(await adapter.keys("a:*")).toEqual(["a:1", "a:2"]);
      expect(client.scanIterator).toHaveBeenCalledWith({MATCH: "a:*", COUNT: 100});
    });

    it("should flush the database on clear without namespace", async () => {
      await adapter.set("a", "1");
      await adapter.clear();

      expect(client.flushDb).toHaveBeenCalled();
      expect(client.db.size).toBe(0);
    });

    it("should scope keys and clear to the Keyv namespace", async () => {
      await client.set("other", "value");

      const keyv = new Keyv({store: adapter, namespace: "app"});

      await keyv.set("k", "v");

      expect(client.db.has("app:k")).toBe(true);
      expect(await adapter.keys()).toEqual(["k"]);

      await keyv.clear();

      expect(client.flushDb).not.toHaveBeenCalled();
      expect([...client.db.keys()]).toEqual(["other"]);
    });

    it("should work with cache-manager v7", async () => {
      const cache = createCache({stores: [new Keyv({store: adapter, useKeyPrefix: false})]});

      await cache.set("key", {a: 1}, 10000);
      await cache.mset([{key: "k1", value: 1}]);

      expect(await cache.get("key")).toEqual({a: 1});
      expect(await cache.mget(["key", "k1", "k2"])).toEqual([{a: 1}, 1, undefined]);
      expect(client.db.get("key")?.px).toEqual(10000);
      expect(await cache.ttl("key")).toBeGreaterThan(Date.now());

      await cache.del("key");

      expect(await cache.get("key")).toBeUndefined();
    });
  });

  describe("with a cluster", () => {
    it("should scan, flush and use single key commands on every master", async () => {
      const cluster = createFakeCluster();
      const adapter = new RedisKeyvAdapter(cluster as any);

      await adapter.setMany([
        {key: "a", value: "1"},
        {key: "bb", value: "2"}
      ]);

      expect(await adapter.keys()).toEqual(["bb", "a"]);
      expect(await adapter.getMany(["a", "bb"])).toEqual(["1", "2"]);
      expect(cluster.mGet).not.toHaveBeenCalled();
      expect(await adapter.deleteMany(["a"])).toBe(true);

      await adapter.clear();

      expect(cluster.nodes[0].flushDb).toHaveBeenCalled();
      expect(cluster.nodes[1].flushDb).toHaveBeenCalled();
    });
  });
});
