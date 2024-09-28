import {catchAsyncError, Hooks} from "@tsed/core";
import {type Cache, caching} from "cache-manager";
import {Redis} from "ioredis";

import {IORedisStore, ioRedisStore} from "./IORedisStore.js";

vi.mock("ioredis", () => {
  class Redis {
    static Cluster = class {
      hooks = new Hooks();
      connector: any = {};

      constructor(protected options: any = {}) {
        this.connector.options = options;
        setTimeout(() => {
          this.hooks.emit("ready");
        }, 10);
      }

      once(...args: any[]) {
        (this.hooks.on as any)(...args);
        return this;
      }

      disconnect() {
        return undefined;
      }
    };

    hooks = new Hooks();
    cache = new Map();
    connector: any = {};

    constructor(protected options: any = {}) {
      this.connector.options = options;
      setTimeout(() => {
        this.hooks.emit("ready");
      }, 10);
    }

    once(...args: any[]) {
      (this.hooks.on as any)(...args);
      return this;
    }

    async del(keys: string | string[]) {
      await Promise.all(([] as string[]).concat(keys).map((key) => this.cache.delete(key)));
    }

    mdel(keys: string[]) {
      return Promise.resolve();
    }

    flushdb() {
      this.cache.clear();
      return Promise.resolve("OK");
    }

    flushall() {
      this.cache.clear();
      return Promise.resolve("OK");
    }

    reset() {
      return Promise.resolve();
    }

    setex(key: string, ttl: any, value: any) {
      this.cache.set(key, {value, ttl});
      return Promise.resolve("OK");
    }

    set(key: string, value: any) {
      this.cache.set(key, {value, ttl: -1});
      return Promise.resolve("OK");
    }

    get(key: string) {
      const cached = this.cache.get(key);

      if (!cached) {
        throw new Error("missing key");
      }
      return Promise.resolve(cached.value);
    }

    mget(keys: string[]) {
      return Promise.resolve(keys.map((key) => this.cache.get(key)?.value));
    }

    mset(keys: [string, unknown][]) {
      return Promise.resolve(keys.map(([key, value]) => this.cache.set(key, value)));
    }

    multi() {
      return this;
    }

    exec() {}

    ttl(key: string) {
      const cached = this.cache.get(key);
      return Promise.resolve(cached?.ttl || -1);
    }

    end() {
      return Promise.resolve(this);
    }

    keys() {
      return [...this.cache.keys()];
    }

    disconnect() {
      return undefined;
    }
  }

  return {
    Redis
  };
});

let redisCache: Cache<IORedisStore>;
let customRedisCache: Cache<IORedisStore>;

const config = {
  host: "127.0.0.1",
  port: 6379,
  password: null,
  db: 0,
  ttl: 5
};

describe("RedisStore", () => {
  beforeEach(async () => {
    redisCache = await caching(ioRedisStore, {
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      ttl: config.ttl
    });

    customRedisCache = await caching(ioRedisStore, {
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      ttl: config.ttl,
      isCacheableValue: (val?: any) => {
        if (val === undefined) {
          // allow undefined
          return true;
        } else if (val === "FooBarString") {
          // disallow FooBarString
          return false;
        }
        return redisCache.store.isCacheableValue(val);
      }
    });

    return new Promise((resolve) => {
      redisCache.store.client.once("ready", () => {
        redisCache.reset().then(resolve);
      });
    });
  });
  afterEach(async () => {
    await redisCache.store.client.disconnect(true);
  });
  describe("initialization", () => {
    it("should create a store with password instead of auth_pass (auth_pass is deprecated for redis > 2.5)", async () => {
      const redisPwdCache = await caching(ioRedisStore, {
        host: config.host,
        port: config.port,
        password: config.password,
        db: config.db,
        ttl: config.ttl
      });

      expect((redisPwdCache.store as any).getClient().options.password).toEqual(config.password);
    });
    it("should create redis store", () => {
      const redisStore = new IORedisStore({
        host: config.host,
        port: config.port,
        db: config.db,
        ttl: config.ttl
      });

      expect(redisStore.getClient()).toBeInstanceOf(Redis);
    });

    it("should create a store clusterConfig", () => {
      caching(ioRedisStore, {
        clusterConfig: {
          nodes: [],
          config: {}
        },
        ttl: config.ttl
      });
    });
  });
  describe("mset", () => {
    beforeEach(() => {
      vi.spyOn(redisCache.store.client, "setex");
      vi.spyOn(redisCache.store.client, "mset");
    });
    afterEach(() => {
      vi.resetAllMocks();
    });
    it("should return a promise", () => {
      expect(redisCache.set("foo", "bar")).toBeInstanceOf(Promise);
    });

    it("should set multiple value with ttl using multi transaction", async () => {
      const result = await redisCache.store.mset([["foo", "bar"]]);
      expect(result).toEqual(undefined);

      expect(redisCache.store.client.setex).toHaveBeenCalledWith("foo", 0.005, '"bar"');
    });

    it("should set multiple value with ttl  using .set()", async () => {
      (redisCache.store as any).storeArgs.ttl = undefined;

      const result2 = await redisCache.store.mset([["foo", "bar"]]);

      expect(result2).toEqual(undefined);
      expect(redisCache.store.client.mset).toHaveBeenCalledWith(["foo", '"bar"']);
    });

    it("should set multiple value with ttl", async () => {
      const result = await redisCache.store.mset([["foo", "bar"]], 300);
      expect(result).toEqual(undefined);
    });
  });

  describe("set", () => {
    it("should return a promise", () => {
      expect(redisCache.set("foo", "bar")).toBeInstanceOf(Promise);
    });

    it("should resolve promise on success (setex)", async () => {
      const result = await redisCache.set("foo", "bar");
      expect(result).toEqual(undefined);
    });

    it("should resolve promise on success", async () => {
      const result = await redisCache.set("foo", "bar");
      expect(result).toEqual(undefined);
    });

    it("should reject promise on error", async () => {
      const error = await catchAsyncError(() => redisCache.set("foo", null));
      expect(!!error).toEqual(true);
    });

    it("should not be able to store a null value (not cacheable)", async () => {
      const error = await catchAsyncError(() => redisCache.set("foo2", null));

      expect(error?.message).toEqual('"null" is not a cacheable value');
    });

    it("should store a value without callback", async () => {
      await redisCache.set("foo", "baz");

      const value = await redisCache.get("foo");
      expect(value).toEqual("baz");
    });

    it("should not store an invalid value", async () => {
      const err = await catchAsyncError(() => redisCache.set("foo1", undefined));
      expect(err?.message).toEqual('""undefined"" is not a cacheable value');
    });

    it("should store an undefined value if permitted by isCacheableValue", async () => {
      expect(customRedisCache.store.isCacheable(undefined)).toBe(true);

      await customRedisCache.set("foo3", undefined);

      const data = await customRedisCache.get("foo3");
      expect(data).toEqual("undefined");
    });

    it("should not store a value disallowed by isCacheableValue", async () => {
      expect(customRedisCache.store.isCacheable("FooBarString")).toBe(false);

      const err = await catchAsyncError(() => customRedisCache.set("foobar", "FooBarString"));

      expect(err?.message).toEqual('""FooBarString"" is not a cacheable value');
    });
  });

  describe("get", () => {
    it("should resolve promise on success", async () => {
      await redisCache.set("foo", "bar");
      const result = await redisCache.get("foo");
      expect(result).toEqual("bar");
    });
    it("should reject promise on error", async () => {
      const error = await catchAsyncError(() => redisCache.get("foo2"));
      expect(!!error).toEqual(true);
    });
    it("should retrieve a value for a given key", async () => {
      const value = "bar";
      await redisCache.set("foo", value);
      const result = await redisCache.get("foo");
      expect(result).toEqual(value);
    });
    it("should retrieve a value for a given key if options provided", async () => {
      const value = "bar";

      await redisCache.set("foo", value);
      const result = await redisCache.get("foo");
      expect(result).toEqual(value);
    });
  });

  describe("mget", () => {
    it("should resolve promise on success", async () => {
      await redisCache.set("foo", "bar");
      const result = await redisCache.store.mget("foo");
      expect(result).toEqual(["bar"]);
    });
  });

  describe("del", () => {
    it("should delete a value for a given key", async () => {
      await redisCache.set("foo", "bar");
      await redisCache.del("foo");
    });
  });

  describe("mdel", () => {
    it("should delete a value for a given key", async () => {
      await redisCache.set("foo", "bar");
      await redisCache.store.mdel("foo");
      const result = await catchAsyncError(() => redisCache.get("foo"));
      expect(result?.message).toEqual("missing key");
    });
  });

  describe("reset", () => {
    it("should flush underlying db", () => {
      redisCache.reset();
    });
  });

  describe("ttl", () => {
    it("should retrieve ttl for a given key", async () => {
      await redisCache.set("foo", "bar", 5);
      const ttl = await redisCache.store.ttl("foo");

      expect(ttl).toEqual(config.ttl);
    });
  });

  describe("keys", () => {
    it("should resolve promise on success", async () => {
      await redisCache.set("foo", "bar");
      const keys = await redisCache.store.keys("f*");
      expect(keys).toEqual(["foo"]);
    });

    it("should return an array of keys for the given pattern", async () => {
      await redisCache.set("foo", "bar");
      const arrayOfKeys = await redisCache.store.keys("f*");
      expect(arrayOfKeys).not.toEqual(null);
      expect(arrayOfKeys.indexOf("foo")).not.toEqual(-1);
    });

    it("should return an array of keys without pattern", async () => {
      await redisCache.set("foo", "bar");
      const arrayOfKeys = await redisCache.store.keys();

      expect(arrayOfKeys).not.toEqual(null);
    });
  });

  describe("isCacheableValue", () => {
    it("should return true when the value is not undefined", () => {
      expect(redisCache.store.isCacheable(0)).toBe(true);
      expect(redisCache.store.isCacheable(100)).toBe(true);
      expect(redisCache.store.isCacheable("")).toBe(true);
      expect(redisCache.store.isCacheable("test")).toBe(true);
    });

    it("should return false when the value is undefined", () => {
      expect(redisCache.store.isCacheable(undefined)).toBe(false);
    });

    it("should return false when the value is null", () => {
      expect(redisCache.store.isCacheable(null)).toBe(false);
    });
  });

  describe("overridable isCacheableValue function", () => {
    let redisCache2: any;

    beforeEach(async () => {
      redisCache2 = await caching(ioRedisStore, {
        ttl: 60,
        isCacheableValue: () => {
          return "I was overridden" as any;
        }
      });
    });

    it("should return its return value instead of the built-in function", () => {
      expect(redisCache2.store.isCacheableValue(0)).toEqual("I was overridden");
    });
  });
});
