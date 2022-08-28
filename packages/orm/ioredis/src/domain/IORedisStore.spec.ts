import {catchAsyncError, Hooks} from "@tsed/core";
import {caching} from "cache-manager";
import Redis from "ioredis";

import {IORedisStore, ioRedisStore} from "./IORedisStore";

jest.mock("ioredis", () => {
  return class Redis {
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

    async del(key: string) {
      const result = this.cache.delete(key);
      return result ? 1 : 0;
    }

    async flushdb() {
      this.cache.clear();
      return "OK";
    }

    async setex(key: string, ttl: any, value: any) {
      this.cache.set(key, {value, ttl});
      return "OK";
    }

    async set(key: string, value: any) {
      this.cache.set(key, {value, ttl: -1});
      return "OK";
    }

    async get(key: string) {
      const cached = this.cache.get(key);

      if (!cached) {
        throw new Error("missing key");
      }
      return cached.value;
    }

    async ttl(key: string) {
      const cached = this.cache.get(key);
      return cached?.ttl || -1;
    }

    async end() {
      return this;
    }

    keys() {
      return [...this.cache.keys()];
    }

    disconnect() {
      return undefined;
    }
  };
});

let redisCache: any;
let customRedisCache: any;

const config = {
  host: "127.0.0.1",
  port: 6379,
  password: null,
  db: 0,
  ttl: 5
};

describe("RedisStore", () => {
  beforeEach((done) => {
    redisCache = caching({
      store: ioRedisStore,
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      ttl: config.ttl
    });

    customRedisCache = caching({
      store: ioRedisStore,
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      ttl: config.ttl,
      isCacheableValue: (val) => {
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

    redisCache.store.getClient().once("ready", () => redisCache.reset(done));
  });
  afterEach(() => {
    redisCache.store.getClient().disconnect({reconnect: true});
  });
  describe("initialization", () => {
    it("should create a store with password instead of auth_pass (auth_pass is deprecated for redis > 2.5)", async () => {
      const redisPwdCache = caching({
        store: ioRedisStore,
        host: config.host,
        port: config.port,
        password: config.password,
        db: config.db,
        ttl: config.ttl
      });

      expect((redisPwdCache.store as any).getClient().options.password).toEqual(config.password);
    });
    it("should create redis store", async () => {
      const redisStore = new IORedisStore({
        host: config.host,
        port: config.port,
        db: config.db,
        ttl: config.ttl
      });

      expect(redisStore.getClient()).toBeInstanceOf(Redis);
    });

    it("should create a store with an external redisInstance", () => {
      const externalRedisInstanceCache = caching({
        store: ioRedisStore,
        redisInstance: new Redis({
          host: config.host,
          port: config.port,
          password: config.password,
          db: config.db
        } as any),
        ttl: config.ttl
      });

      expect((externalRedisInstanceCache.store as any).getClient().options.password).toEqual(config.password);
    });

    it("should create a store clusterConfig", () => {
      caching({
        store: ioRedisStore,
        clusterConfig: {
          nodes: [],
          config: {}
        },
        ttl: config.ttl
      });
    });
  });

  describe("set", () => {
    it("should return a promise", () => {
      expect(redisCache.set("foo", "bar")).toBeInstanceOf(Promise);
    });

    it("should resolve promise on success", async () => {
      const result = await redisCache.set("foo", "bar");
      expect(result).toEqual("OK");
    });

    it("should reject promise on error", async () => {
      const error = await catchAsyncError(() => redisCache.set("foo", null));
      expect(!!error).toEqual(true);
    });

    it("should store a value without ttl", (done) => {
      redisCache.set("foo", "bar", (err: any) => {
        expect(err).toEqual(null);
        done();
      });
    });

    it("should store a value with a specific ttl", (done) => {
      redisCache.set("foo", "bar", config.ttl, (err: any) => {
        expect(err).toEqual(null);
        done();
      });
    });

    it("should store a value with a infinite ttl", (done) => {
      redisCache.set("foo", "bar", {ttl: 0}, (err: any) => {
        expect(err).toEqual(null);
        redisCache.ttl("foo", (err: any, ttl: number) => {
          expect(err).toEqual(null);
          expect(ttl).toEqual(-1);
          done();
        });
      });
    });

    it("should not be able to store a null value (not cacheable)", (done) => {
      redisCache.set("foo2", null, (err: any) => {
        if (err) {
          return done();
        }
        done(new Error("Null is not a valid value!"));
      });
    });

    it("should store a value without callback", (done) => {
      redisCache.set("foo", "baz");
      redisCache.get("foo", (err: any, value: any) => {
        expect(err).toEqual(null);
        expect(value).toEqual("baz");
        done();
      });
    });

    it("should not store an invalid value", (done) => {
      redisCache.set("foo1", undefined, (err: any) => {
        try {
          expect(err).not.toEqual(null);
          expect(err.message).toEqual('"undefined" is not a cacheable value');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("should store an undefined value if permitted by isCacheableValue", (done) => {
      expect(customRedisCache.store.isCacheableValue(undefined)).toBe(true);
      customRedisCache.set("foo3", undefined, (err: any) => {
        try {
          expect(err).toEqual(null);
          customRedisCache.get("foo3", (err: any, data: any) => {
            try {
              expect(err).toEqual(null);
              // redis stored undefined as 'undefined'
              expect(data).toEqual("undefined");
              done();
            } catch (e) {
              done(e);
            }
          });
        } catch (e) {
          done(e);
        }
      });
    });

    it("should not store a value disallowed by isCacheableValue", (done) => {
      expect(customRedisCache.store.isCacheableValue("FooBarString")).toBe(false);
      customRedisCache.set("foobar", "FooBarString", (err: any) => {
        try {
          expect(err).not.toEqual(null);
          expect(err.message).toEqual('"FooBarString" is not a cacheable value');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("should return an error if there is an error acquiring a connection", (done) => {
      redisCache.store.getClient().end(true);
      redisCache.set("foo", "bar", (err: any) => {
        expect(err).not.toEqual(null);
        done();
      });
    });
  });

  describe("get", () => {
    it("should return value from callback", async () => {
      await redisCache.set("foo3", "bar");

      const result = await new Promise((resolve, reject) => {
        redisCache.get("foo3", (err: any, value: any) => {
          err ? reject(err) : resolve(value);
        });
      });

      expect(result).toEqual("bar");
    });
    it("should reject error from callback", async () => {
      const error = await catchAsyncError(() => {
        return new Promise((resolve, reject) => {
          redisCache.get("foo2", (err: any, value: any) => {
            err ? reject(err) : resolve(value);
          });
        });
      });
      expect(!!error).toEqual(true);
    });
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
      const result = await redisCache.get("foo", {});
      expect(result).toEqual(value);
    });
  });

  describe("del", () => {
    it("should delete a value for a given key", (done) => {
      redisCache.set("foo", "bar", () => {
        redisCache.del("foo", (err: any) => {
          expect(err).toEqual(null);
          done();
        });
      });
    });

    it("should delete a value for a given key without callback", (done) => {
      redisCache.set("foo", "bar", () => {
        redisCache.del("foo");
        done();
      });
    });

    it("should return an error if there is an error acquiring a connection", (done) => {
      redisCache.store.getClient().end(true);
      redisCache.del("foo", (err: any) => {
        expect(err).not.toEqual(null);
        done();
      });
    });
  });

  describe("reset", () => {
    it("should flush underlying db", (done) => {
      redisCache.reset((err: any) => {
        expect(err).toEqual(null);
        done();
      });
    });

    it("should flush underlying db without callback", (done) => {
      redisCache.reset();
      done();
    });

    it("should return an error if there is an error acquiring a connection", (done) => {
      redisCache.store.getClient().end(true);
      redisCache.reset((err: any) => {
        expect(err).not.toEqual(null);
        done();
      });
    });
  });

  describe("ttl", () => {
    it("should retrieve ttl for a given key", (done) => {
      redisCache.set("foo", "bar", () => {
        redisCache.ttl("foo", (err: any, ttl: number) => {
          expect(err).toEqual(null);
          expect(ttl).toEqual(config.ttl);
          done();
        });
      });
    });

    it("should retrieve ttl for an invalid key", (done) => {
      redisCache.ttl("invalidKey", (err: any, ttl: number) => {
        expect(err).toEqual(null);
        expect(ttl).not.toEqual(null);
        done();
      });
    });

    it("should return an error if there is an error acquiring a connection", (done) => {
      redisCache.store.getClient().end(true);
      redisCache.ttl("foo", (err: any) => {
        expect(err).not.toEqual(null);
        done();
      });
    });
  });

  describe("keys", () => {
    it("should resolve promise on success", async () => {
      await redisCache.set("foo", "bar");
      const keys = await redisCache.keys("f*");
      expect(keys).toEqual(["foo"]);
    });

    it("should return an array of keys for the given pattern", (done) => {
      redisCache.set("foo", "bar", () => {
        redisCache.keys("f*", (err: any, arrayOfKeys: any[]) => {
          expect(err).toEqual(null);
          expect(arrayOfKeys).not.toEqual(null);
          expect(arrayOfKeys.indexOf("foo")).not.toEqual(-1);
          done();
        });
      });
    });

    it("should return an array of keys without pattern", (done) => {
      redisCache.set("foo", "bar", () => {
        redisCache.keys((err: any, arrayOfKeys: any[]) => {
          expect(err).toEqual(null);
          expect(arrayOfKeys).not.toEqual(null);
          expect(arrayOfKeys.indexOf("foo")).not.toEqual(-1);
          done();
        });
      });
    });

    it("should return an error if there is an error acquiring a connection", (done) => {
      redisCache.store.getClient().end(true);
      redisCache.keys("foo", (err: any) => {
        expect(err).not.toEqual(null);
        done();
      });
    });
  });

  describe("isCacheableValue", () => {
    it("should return true when the value is not undefined", () => {
      expect(redisCache.store.isCacheableValue(0)).toBe(true);
      expect(redisCache.store.isCacheableValue(100)).toBe(true);
      expect(redisCache.store.isCacheableValue("")).toBe(true);
      expect(redisCache.store.isCacheableValue("test")).toBe(true);
    });

    it("should return false when the value is undefined", () => {
      expect(redisCache.store.isCacheableValue(undefined)).toBe(false);
    });

    it("should return false when the value is null", () => {
      expect(redisCache.store.isCacheableValue(null)).toBe(false);
    });
  });

  describe("overridable isCacheableValue function", () => {
    let redisCache2: any;

    beforeEach(() => {
      redisCache2 = caching({
        store: ioRedisStore,
        ttl: 60,
        isCacheableValue: () => {
          return "I was overridden" as any;
        }
      });
    });

    it("should return its return value instead of the built-in function", (done) => {
      expect(redisCache2.store.isCacheableValue(0)).toEqual("I was overridden");
      done();
    });
  });
});
