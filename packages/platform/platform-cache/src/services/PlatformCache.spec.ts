import {Keyv, type KeyvStoreAdapter} from "keyv";
import {PlatformCache} from "./PlatformCache.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {UseCache} from "../decorators/useCache.js";
import {logger} from "@tsed/di";
import type {OnCreateCacheManager} from "../interfaces/interfaces.js";

function createAdapter(): KeyvStoreAdapter & {map: Map<string, any>} {
  const map = new Map<string, any>();

  return {
    map,
    opts: {},
    get: vi.fn(async (key: string) => map.get(key)),
    set: vi.fn(async (key: string, value: any) => {
      map.set(key, value);
      return true;
    }),
    delete: vi.fn(async (key: string) => map.delete(key)),
    clear: vi.fn(async () => map.clear()),
    on: vi.fn()
  } as any;
}

describe("PlatformCache", () => {
  describe("with the default memory store", () => {
    beforeEach(async () => {
      await PlatformTest.create({
        cache: {
          ttl: 300
        }
      });
    });

    afterEach(() => {
      return PlatformTest.reset();
    });

    it("should create single cache", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      expect(cacheManager.disabled()).toEqual(false);
      expect(cacheManager.cache?.stores).toHaveLength(1);

      await cacheManager.set("key", "value");
      await cacheManager.set("key2", "value2");
      expect(await cacheManager.get("key")).toBe("value");
      expect(await cacheManager.get("key2")).toBe("value2");

      await cacheManager.del("key2");

      expect(await cacheManager.get("key2")).toBeUndefined();

      await cacheManager.reset();

      expect(await cacheManager.get("key")).toBeUndefined();

      const result = await cacheManager.wrap("key", () => {
        return Promise.resolve("valuePromised");
      });

      expect(result).toBe("valuePromised");
      expect(await cacheManager.get("key")).toBe("valuePromised");
    });

    it("should return the calculated calculateTTL", () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      expect(cacheManager.calculateTTL({}, 400)).toBe(400);
      expect(cacheManager.calculateTTL({}, () => 200)).toBe(200);
      expect(cacheManager.calculateTTL({})).toBe(300);
      expect(cacheManager.calculateTTL()).toBe(300);
    });

    it("should return undefined when ttl and defaultTtl are undefined", () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      vi.spyOn(cacheManager, "defaultTtl").mockReturnValue(undefined);

      expect(cacheManager.calculateTTL({})).toBeUndefined();
    });

    it("should get matching keys", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      await cacheManager.set("key", "value");
      await cacheManager.set("key2", "value2");

      const keys1 = await cacheManager.getMatchingKeys("key*");
      const keys2 = await cacheManager.getMatchingKeys("key2");

      expect(keys1).toEqual(["key", "key2"]);
      expect(keys2).toEqual(["key2"]);
    });

    it("should list keys by pattern", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      await cacheManager.set("a:1", 1);
      await cacheManager.set("a:2", 2);
      await cacheManager.set("b:1", 3);

      expect(await cacheManager.keys()).toEqual(["a:1", "a:2", "b:1"]);
      expect(await cacheManager.keys("a:*")).toEqual(["a:1", "a:2"]);
      expect(await cacheManager.deleteKeys("a:*")).toEqual(["a:1", "a:2"]);
      expect(await cacheManager.keys()).toEqual(["b:1"]);
    });

    it("should get keys of a given class/method", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      class Test {
        @UseCache({
          prefix: "TEST"
        })
        async test() {}
      }

      await cacheManager.set(cacheManager.buildEntryKey(Test, "test", "arg"), "value");
      await cacheManager.set(cacheManager.buildEntryKey(Test, "test", "arg2"), "value2");

      const keys = await cacheManager.getKeysOf(Test, "test");

      expect(keys).toEqual(["TEST:arg", "TEST:arg2"]);
    });

    it("should include global cache prefix when getting keys of a given class/method", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      class Test {
        @UseCache({
          prefix: "TEST"
        })
        async test() {}
      }

      vi.spyOn(cacheManager, "cachePrefix").mockReturnValue("GLOBAL");

      await cacheManager.set(cacheManager.buildEntryKey(Test, "test", "arg"), "value");
      await cacheManager.set(cacheManager.buildEntryKey(Test, "test", "arg2"), "value2");

      const keys = await cacheManager.getKeysOf(Test, "test");

      expect(keys).toEqual(["GLOBAL:TEST:arg", "GLOBAL:TEST:arg2"]);
    });

    it("should delete matching keys", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      await cacheManager.set("key", "value");
      await cacheManager.set("key2", "value2");

      const keys1 = await cacheManager.getMatchingKeys("key*");
      const keys2 = await cacheManager.deleteMatchingKeys("key*");

      expect(keys1).toEqual(["key", "key2"]);
      expect(keys2).toEqual(["key", "key2"]);
      expect(await cacheManager.keys()).toEqual([]);
    });

    describe("defaultKeyResolver()", () => {
      it("return the default key resolver from settings", () => {
        const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);
        const keyResolver = cacheManager.defaultKeyResolver();

        const value = keyResolver(["test"], {});
        expect(value).toEqual("test");

        const value2 = keyResolver([{test: "test"}], {});
        expect(value2).toEqual('{"test":"test"}');
      });
    });

    describe("ttl()", () => {
      afterEach(() => {
        vi.useRealTimers();
      });

      it("should return the remaining time to live in seconds", async () => {
        vi.useFakeTimers({toFake: ["Date"]});
        const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

        await cacheManager.set("test", "value", {ttl: 10});
        vi.advanceTimersByTime(4000);

        expect(await cacheManager.ttl("test")).toEqual(6);
      });

      it("should use the default ttl (seconds)", async () => {
        vi.useFakeTimers({toFake: ["Date"]});
        const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

        await cacheManager.set("test", "value");

        expect(await cacheManager.ttl("test")).toEqual(300);

        vi.advanceTimersByTime(300_001);

        expect(await cacheManager.get("test")).toBeUndefined();
      });

      it("should disable the expiration when ttl is null", async () => {
        vi.useFakeTimers({toFake: ["Date"]});
        const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

        await cacheManager.set("test", "value", {ttl: null});
        vi.advanceTimersByTime(1_000_000);

        expect(await cacheManager.ttl("test")).toBeUndefined();
        expect(await cacheManager.get("test")).toEqual("value");
      });

      it("should return undefined when the key doesn't exist", async () => {
        const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

        expect(await cacheManager.ttl("unknown")).toBeUndefined();
      });
    });
    describe("getCachedObject()", () => {
      it("should get key from cache", async () => {
        const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

        await cacheManager.setCachedObject("key", {data: "data"}, {ttl: 10});
        const result = await cacheManager.getCachedObject("key");

        expect(result).toEqual({
          data: '{"data":"data"}',
          ttl: 10
        });
      });
      it("should catch and log error", async () => {
        const cacheManager: any = PlatformTest.get<PlatformCache>(PlatformCache);
        const error = new Error("message");

        vi.spyOn(cacheManager, "get").mockRejectedValue(error);
        const errorSpy = vi.spyOn(logger(), "error");

        await cacheManager.getCachedObject("key");

        expect(cacheManager.get).toHaveBeenCalledWith("key");
        expect(errorSpy).toHaveBeenCalledWith({
          error_message: "message",
          error_name: "Error",
          error_stack: expect.any(String),
          event: "CACHE_ERROR",
          method: "getCachedObject"
        });
      });
    });
    describe("setCachedObject()", () => {
      it("should set cached object without ttl when ttl is undefined", async () => {
        const cacheManager: any = PlatformTest.get<PlatformCache>(PlatformCache);
        vi.spyOn(cacheManager, "set");

        await cacheManager.setCachedObject("key", {data: "data"}, {});

        expect(cacheManager.set).toHaveBeenCalledWith("key", {data: '{"data":"data"}'}, undefined);
      });

      it("should catch and log error", async () => {
        const cacheManager: any = PlatformTest.get<PlatformCache>(PlatformCache);
        const error = new Error("message");

        vi.spyOn(cacheManager, "set").mockRejectedValue(error);
        const errorSpy = vi.spyOn(logger(), "error");

        await cacheManager.setCachedObject("key", {data: "data"}, {ttl: 10});

        expect(cacheManager.set).toHaveBeenCalledWith("key", {data: '{"data":"data"}', ttl: 10}, {ttl: 10});
        expect(errorSpy).toHaveBeenLastCalledWith({
          error_message: "message",
          error_name: "Error",
          error_stack: expect.any(String),
          event: "CACHE_ERROR",
          method: "setCachedObject"
        });
      });
    });
    describe("refresh()", () => {
      it("should set the call context with forceRefresh to true", async () => {
        const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

        expect(cacheManager.isForceRefresh()).toEqual(false);

        await cacheManager.refresh(() => {
          expect(cacheManager.isForceRefresh()).toEqual(true);
        });

        expect(cacheManager.isForceRefresh()).toEqual(false);
      });
    });
  });
  describe("with a bounded memory store (max)", () => {
    beforeEach(() => PlatformTest.create({cache: {max: 2}}));
    afterEach(() => PlatformTest.reset());

    it("should evict the least recently used key", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      await cacheManager.set("a", 1);
      await cacheManager.set("b", 2);
      await cacheManager.get("a");
      await cacheManager.set("c", 3);

      expect(await cacheManager.keys()).toEqual(["a", "c"]);
      expect(await cacheManager.get("b")).toBeUndefined();
    });
  });
  describe("with a Keyv store adapter", () => {
    let adapter: ReturnType<typeof createAdapter>;

    beforeEach(() => {
      adapter = createAdapter();

      return PlatformTest.create({cache: {store: adapter, ttl: 10}});
    });
    afterEach(() => PlatformTest.reset());

    it("should store the keys without keyv namespace and the ttl in milliseconds", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      await cacheManager.set("prefix:key", "value");

      expect(adapter.set).toHaveBeenCalledWith("prefix:key", expect.any(String), 10000);
      expect(await cacheManager.get("prefix:key")).toEqual("value");
    });

    it("should use the keys() method of the adapter", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);
      (adapter as any).keys = vi.fn().mockResolvedValue(["a:1"]);

      expect(await cacheManager.keys("a:*")).toEqual(["a:1"]);
      expect((adapter as any).keys).toHaveBeenCalledWith("a:*");
    });

    it("should return an empty list when the adapter can't list its keys", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      await cacheManager.set("key", "value");

      expect(await cacheManager.keys()).toEqual([]);
    });
  });
  describe("with multiple stores", () => {
    let adapter: ReturnType<typeof createAdapter>;
    let memory: Keyv;

    beforeEach(() => {
      adapter = createAdapter();
      memory = new Keyv();

      return PlatformTest.create({
        cache: {
          stores: [memory, adapter],
          ttl: 300
        }
      });
    });
    afterEach(() => {
      return PlatformTest.reset();
    });

    it("should create multiple cache", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      expect(cacheManager.cache?.stores[0]).toBe(memory);

      await cacheManager.set("key", "value");
      await cacheManager.set("key2", "value2");
      expect(adapter.map.has("key")).toBe(true);
      expect(await memory.get("key")).toBe("value");
      expect(await cacheManager.get("key")).toBe("value");
      expect(await cacheManager.get("key2")).toBe("value2");
      expect(await cacheManager.keys()).toEqual(["key", "key2"]);

      await cacheManager.del("key2");

      expect(await cacheManager.get("key2")).toBeUndefined();

      await cacheManager.reset();

      expect(await cacheManager.get("key")).toBeUndefined();
      expect(adapter.clear).toHaveBeenCalled();

      const result = await cacheManager.wrap("key", () => {
        return Promise.resolve("valuePromised");
      });

      expect(result).toBe("valuePromised");
    });
  });
  describe("$onCreateCacheManager", () => {
    afterEach(() => PlatformTest.reset());

    it("should call the hook with the cache-manager v7 cache", async () => {
      const listener: OnCreateCacheManager = {$onCreateCacheManager: vi.fn()};
      const {$on, $off} = await import("@tsed/hooks");

      $on("$onCreateCacheManager", listener.$onCreateCacheManager);

      await PlatformTest.create({cache: {}});
      $off("$onCreateCacheManager", listener.$onCreateCacheManager);

      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      expect(listener.$onCreateCacheManager).toHaveBeenCalledTimes(1);
      expect(listener.$onCreateCacheManager).toHaveBeenCalledWith(cacheManager.cache);
      expect(typeof cacheManager.cache?.wrap).toBe("function");
    });
  });
  describe("with disabled cache", () => {
    beforeEach(() =>
      PlatformTest.create({
        cache: false
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should mock methods", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      expect(cacheManager.disabled()).toEqual(true);

      await cacheManager.set("key", "value");
      await cacheManager.set("key2", "value2");
      expect(await cacheManager.get("key")).toBeUndefined();
      expect(await cacheManager.get("key2")).toBeUndefined();

      await cacheManager.del("key2");

      expect(await cacheManager.get("key2")).toBeUndefined();

      await cacheManager.reset();

      expect(await cacheManager.get("key")).toBeUndefined();
      expect(await cacheManager.keys()).toEqual([]);

      const result = await cacheManager.wrap("key", () => {
        return Promise.resolve("valuePromised");
      });

      expect(result).toBe("valuePromised");
    });
  });
});
