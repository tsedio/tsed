import {isClass} from "@tsed/core";
import {logger, runInContext} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";
import {PlatformTest} from "@tsed/platform-http/testing";

import {UseCache} from "../decorators/useCache.js";
import {PlatformCache} from "../services/PlatformCache.js";
import {isEndpoint} from "../utils/isEndpoint.js";
import {PlatformCacheInterceptor} from "./PlatformCacheInterceptor.js";

const defaultKeyResolver = (args: any[]) => {
  return args.map((arg: any) => (isClass(arg) ? JSON.stringify(serialize(arg)) : arg)).join(":");
};

async function getInterceptorFixture(opts: any = {}) {
  const cache: any = {
    get: vi.fn().mockResolvedValue(false),
    set: vi.fn().mockResolvedValue(false),
    del: vi.fn().mockResolvedValue(true),
    ttl: vi.fn().mockResolvedValue(opts.ttl || 6999),
    calculateTTL: vi.fn().mockImplementation((result: any, ttl: any) => ttl),
    isForceRefresh: vi.fn().mockReturnValue(opts.forceRefresh)
  };

  const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
    {
      token: PlatformCache,
      use: cache
    }
  ]);

  return {cache, interceptor};
}

vi.mock("../utils/isEndpoint");

describe("PlatformCacheInterceptor", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("intercept()", () => {
    it("should intercept the method and call endpoint cache method", async () => {
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: {
            disabled: vi.fn().mockReturnValue(false)
          }
        }
      ]);
      vi.spyOn(interceptor as any, "cacheMethod").mockResolvedValue("test");
      vi.spyOn(interceptor as any, "cacheResponse").mockResolvedValue("test");
      (isEndpoint as any).mockReturnValue(true);

      const context: any = {};
      const next: any = vi.fn();

      await interceptor.intercept(context, next);

      expect((interceptor as any).cacheResponse).toHaveBeenCalledWith(context, next);
    });
    it("should intercept the method and call service cache method", async () => {
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: {
            disabled: vi.fn().mockReturnValue(false)
          }
        }
      ]);

      vi.spyOn(interceptor as any, "cacheMethod").mockResolvedValue("test");
      vi.spyOn(interceptor as any, "cacheResponse").mockResolvedValue("test");
      (isEndpoint as any).mockReturnValue(false);

      const context: any = {};
      const next: any = vi.fn();

      await interceptor.intercept(context, next);

      expect((interceptor as any).cacheMethod).toHaveBeenCalledWith(context, next);
    });
    it("should do nothing when the cache is disabled", async () => {
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: {
            disabled: vi.fn().mockReturnValue(true)
          }
        }
      ]);

      vi.spyOn(interceptor as any, "cacheMethod").mockResolvedValue("test");
      vi.spyOn(interceptor as any, "cacheResponse").mockResolvedValue("test");
      (isEndpoint as any).mockReturnValue(false);

      const context: any = {};
      const next: any = vi.fn();

      await interceptor.intercept(context, next);

      expect((interceptor as any).cacheResponse).not.toHaveBeenCalled();
      expect((interceptor as any).cacheMethod).not.toHaveBeenCalled();
    });
  });
  describe("canRefreshInBackground()", () => {
    it("should refresh key in background", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      const $ctx = PlatformTest.createRequestContext();

      const next = vi.fn();

      await runInContext($ctx, () => {
        return interceptor.canRefreshInBackground("key", {refreshThreshold: 300, ttl: 10000}, next, $ctx);
      });

      expect(cache.get).toHaveBeenCalledWith("$$queue:key");
      expect(cache.set).toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
      expect(cache.del).toHaveBeenCalledWith("$$queue:key");
      expect(cache.ttl).toHaveBeenCalledWith("key");
      expect(next).toHaveBeenCalledWith();
    });
    it("should not refresh key in background", async () => {
      const {cache, interceptor} = await getInterceptorFixture({
        ttl: 9800
      });
      const $ctx = PlatformTest.createRequestContext();

      const next = vi.fn();

      await runInContext($ctx, () =>
        interceptor.canRefreshInBackground(
          "key",
          {
            refreshThreshold: 300,
            ttl: 10000
          },
          next,
          $ctx
        )
      );

      expect(cache.get).toHaveBeenCalledWith("$$queue:key");
      expect(cache.ttl).toHaveBeenCalledWith("key");
      expect(cache.set).toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
      expect(cache.del).toHaveBeenCalledWith("$$queue:key");
      expect(next).not.toHaveBeenCalled();
    });
    it("should refresh key in background with cached ttl when ttl option is a function", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      const $ctx = PlatformTest.createRequestContext();

      const next = vi.fn();

      await runInContext($ctx, () => {
        return interceptor.canRefreshInBackground(
          "key",
          {
            refreshThreshold: 300,
            ttl: () => 10000,
            cachedTTL: 10000
          },
          next,
          $ctx
        );
      });

      expect(cache.get).toHaveBeenCalledWith("$$queue:key");
      expect(cache.ttl).toHaveBeenCalledWith("key");
      expect(cache.set).toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
      expect(cache.del).toHaveBeenCalledWith("$$queue:key");
      expect(next).toHaveBeenCalledWith();
    });
    it("should skip refresh when cooldown key is present", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      const $ctx = PlatformTest.createRequestContext();

      cache.get = vi.fn().mockImplementation((key: string) => {
        if (key === "$$refresh-cooldown:key") {
          return Promise.resolve(true);
        }

        return Promise.resolve(false);
      });

      const next = vi.fn();

      await runInContext($ctx, () => {
        return interceptor.canRefreshInBackground("key", {refreshThreshold: 300, ttl: 10000}, next, $ctx);
      });

      expect(cache.get).toHaveBeenCalledWith("$$queue:key");
      expect(cache.get).toHaveBeenCalledWith("$$refresh-cooldown:key");
      expect(cache.set).not.toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
      expect(cache.ttl).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
    it("should set cooldown key when refresh is triggered", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      const $ctx = PlatformTest.createRequestContext();

      const next = vi.fn();

      await runInContext($ctx, () => {
        return interceptor.canRefreshInBackground(
          "key",
          {
            refreshThreshold: 300,
            ttl: 10000,
            cachedTTL: 10000
          },
          next,
          $ctx
        );
      });

      expect(cache.set).toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
      expect(cache.set).toHaveBeenCalledWith("$$refresh-cooldown:key", true, expect.objectContaining({ttl: expect.any(Number)}));
      expect(next).toHaveBeenCalledWith();
    });
    it("should serialize concurrent refresh checks for the same key", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      const $ctx = PlatformTest.createRequestContext();
      const store = new Map<string, any>();

      cache.get = vi.fn().mockImplementation((key: string) => Promise.resolve(store.get(key)));
      cache.set = vi.fn().mockImplementation((key: string, value: any) => {
        store.set(key, value);
        return Promise.resolve();
      });
      cache.del = vi.fn().mockImplementation((key: string) => {
        store.delete(key);
        return Promise.resolve();
      });
      cache.ttl = vi.fn().mockResolvedValue(6999);

      const next = vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      await Promise.all([
        runInContext($ctx, () =>
          interceptor.canRefreshInBackground(
            "key",
            {
              refreshThreshold: 300,
              ttl: 10000,
              cachedTTL: 10000
            },
            next,
            $ctx
          )
        ),
        runInContext($ctx, () =>
          interceptor.canRefreshInBackground(
            "key",
            {
              refreshThreshold: 300,
              ttl: 10000,
              cachedTTL: 10000
            },
            next,
            $ctx
          )
        )
      ]);

      expect(next).toHaveBeenCalledTimes(1);
      expect(cache.set).toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
      expect(cache.set).toHaveBeenCalledWith("$$refresh-cooldown:key", true, expect.objectContaining({ttl: expect.any(Number)}));
    });
  });
  describe("cacheMethod()", () => {
    it("should bypass method cache when byPass returns true", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      cache.getCachedObject = vi.fn();
      cache.setCachedObject = vi.fn();
      cache.defaultKeyResolver = () => defaultKeyResolver;

      class Test {
        @UseCache({
          ttl: 10000,
          byPass: () => true
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn().mockResolvedValue("fresh");
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value"],
        options: {
          ttl: 10000,
          byPass: () => true
        }
      };

      const result = await interceptor.cacheMethod(context, next);

      expect(cache.getCachedObject).not.toHaveBeenCalled();
      expect(cache.setCachedObject).not.toHaveBeenCalled();
      expect(result).toEqual("fresh");
    });
    it("should return the cached response", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      cache.getCachedObject = vi.fn().mockResolvedValue({
        data: JSON.stringify({data: "data"})
      });
      cache.setCachedObject = vi.fn().mockResolvedValue("test");
      cache.defaultKeyResolver = () => defaultKeyResolver;

      class Test {
        @UseCache({
          ttl: 10000,
          refreshThreshold: 1000
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn().mockReturnValue({data: "refreshed"});
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value"],
        options: {
          ttl: 10000,
          refreshThreshold: 1000
        }
      };

      vi.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();

      const result = await interceptor.cacheMethod(context, next);

      expect(cache.getCachedObject).toHaveBeenCalledWith("Test:test:value");
      expect(result).toEqual({
        data: "data"
      });

      (interceptor.canRefreshInBackground as any).mock.calls[0][2]();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(cache.setCachedObject).toHaveBeenCalledWith(
        "Test:test:value",
        {data: "refreshed"},
        {
          args: ["value"],
          ttl: 10000
        }
      );
    });
    it("should return the cached response (prefix)", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      cache.getCachedObject = vi.fn().mockResolvedValue({
        data: JSON.stringify({data: "data"})
      });
      cache.setCachedObject = vi.fn().mockResolvedValue("test");
      cache.defaultKeyResolver = () => defaultKeyResolver;

      class Test {
        @UseCache({
          prefix: "TEST",
          ttl: 10000,
          refreshThreshold: 1000
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn().mockReturnValue({data: "refreshed"});
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value"],
        options: {
          prefix: "TEST",
          ttl: 10000,
          refreshThreshold: 1000
        }
      };

      vi.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();

      const result = await interceptor.cacheMethod(context, next);

      expect(cache.getCachedObject).toHaveBeenCalledWith("TEST:value");
      expect(result).toEqual({
        data: "data"
      });

      (interceptor.canRefreshInBackground as any).mock.calls[0][2]();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(cache.setCachedObject).toHaveBeenCalledWith(
        "TEST:value",
        {data: "refreshed"},
        {
          args: ["value"],
          ttl: 10000
        }
      );
    });
    it("should force the refresh data", async () => {
      const {cache, interceptor} = await getInterceptorFixture({
        forceRefresh: true
      });
      cache.getCachedObject = vi.fn().mockResolvedValue({
        data: JSON.stringify({data: "data"})
      });
      cache.setCachedObject = vi.fn().mockResolvedValue("test");
      cache.defaultKeyResolver = () => defaultKeyResolver;

      class Test {
        @UseCache({
          ttl: 10000,
          refreshThreshold: 1000
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn().mockReturnValue({data: "refreshed"});
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value"],
        options: {
          ttl: 10000,
          refreshThreshold: 1000
        }
      };

      vi.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();

      const result = await interceptor.cacheMethod(context, next);

      expect(cache.getCachedObject).toHaveBeenCalledWith("Test:test:value");
      expect(result).toEqual({
        data: "refreshed"
      });
      expect(interceptor.canRefreshInBackground).not.toHaveBeenCalled();
      expect(cache.setCachedObject).toHaveBeenCalledWith(
        "Test:test:value",
        {data: "refreshed"},
        {
          args: ["value"],
          ttl: 10000
        }
      );
    });
    it("should call the endpoint and cache the response", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      cache.getCachedObject = vi.fn().mockResolvedValue(undefined);
      cache.setCachedObject = vi.fn().mockResolvedValue("test");
      cache.defaultKeyResolver = () => defaultKeyResolver;

      class Test {
        @UseCache({
          ttl: 10000,
          refreshThreshold: 1000
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn().mockResolvedValue({
        data: "data"
      });
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value"],
        options: {
          ttl: 10000,
          refreshThreshold: 1000
        }
      };

      vi.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();

      const result = await interceptor.cacheMethod(context, next);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(interceptor.canRefreshInBackground).not.toHaveBeenCalled();
      expect(cache.getCachedObject).toHaveBeenCalledWith("Test:test:value");
      expect(cache.setCachedObject).toHaveBeenCalledWith(
        "Test:test:value",
        {data: "data"},
        {
          args: ["value"],
          ttl: 10000
        }
      );
      expect(result).toEqual({
        data: "data"
      });
    });
    it("should doesn't cache nullish result", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      cache.getCachedObject = vi.fn().mockResolvedValue(undefined);
      cache.setCachedObject = vi.fn().mockResolvedValue("test");
      cache.defaultKeyResolver = () => defaultKeyResolver;

      class Test {
        @UseCache({
          ttl: 10000,
          canCache: "no-nullish",
          refreshThreshold: 1000
        })
        test(arg: string) {
          return null;
        }
      }

      const next = vi.fn().mockResolvedValue(null);
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value"],
        options: {
          ttl: 10000,
          canCache: "no-nullish",
          refreshThreshold: 1000
        }
      };

      vi.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();

      const result = await interceptor.cacheMethod(context, next);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(interceptor.canRefreshInBackground).not.toHaveBeenCalled();
      expect(cache.getCachedObject).toHaveBeenCalledWith("Test:test:value");
      expect(cache.setCachedObject).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });
    it("should catch and log error", async () => {
      const {cache, interceptor} = await getInterceptorFixture();
      cache.getCachedObject = vi.fn().mockResolvedValue({data: JSON.stringify({})});
      cache.setCachedObject = vi.fn().mockResolvedValue("test");
      cache.defaultKeyResolver = () => defaultKeyResolver;

      class Test {
        @UseCache({
          ttl: 10000,
          refreshThreshold: 1000
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn().mockResolvedValue({
        data: "data"
      });
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value"],
        options: {
          ttl: 10000,
          refreshThreshold: 1000
        }
      };

      const error = new Error("error");
      vi.spyOn(interceptor, "canRefreshInBackground").mockRejectedValue(error);
      vi.spyOn(logger(), "error");

      await interceptor.cacheMethod(context, next);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(logger().error).toHaveBeenCalledWith({
        event: "CACHE_ERROR",
        method: "cacheMethod",
        class_name: "Test",
        property_key: "test",
        concerned_key: "Test:test:value",
        error_description: "error",
        stack: error.stack
      });
    });
  });
  describe("cacheResponse()", () => {
    it("should return the cached response", async () => {
      const cache = {
        get: vi.fn().mockResolvedValue(false),
        set: vi.fn().mockResolvedValue(false),
        del: vi.fn().mockResolvedValue(true),
        calculateTTL: vi.fn().mockReturnValue(10000),
        getCachedObject: vi.fn().mockResolvedValue({
          data: JSON.stringify({data: "data"})
        }),
        setCachedObject: vi.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        @UseCache({
          ttl: 10000,
          refreshThreshold: 1000
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn();
      const $ctx = PlatformTest.createRequestContext();
      vi.spyOn($ctx.request, "get");
      vi.spyOn($ctx, "get").mockReturnValue(undefined);
      vi.spyOn($ctx.response, "getBody").mockReturnValue({
        data: "data"
      });
      vi.spyOn($ctx.response, "setHeaders").mockReturnThis();
      vi.spyOn($ctx.response, "onEnd").mockImplementation(() => $ctx.response);
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value", $ctx],
        options: {
          ttl: 10000,
          refreshThreshold: 1000
        }
      };

      vi.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();
      vi.spyOn(interceptor as any, "sendResponse").mockResolvedValue(undefined);

      const result = await interceptor.cacheResponse(context, next);

      expect(cache.getCachedObject).toHaveBeenCalledWith("Test:test:value");
      expect(result).toEqual(undefined);
      expect((interceptor as any).sendResponse).toHaveBeenCalledWith({data: '{"data":"data"}'});
      expect($ctx.request.get).toHaveBeenCalledWith("cache-control");

      /*
            console.log('$ctx.response.onEnd.mock.calls[0]', $ctx.response.onEnd.mock.calls[0])
      await $ctx.response.onEnd.mock.calls[0][0]()

      expect(cache.setCachedObject).toHaveBeenCalledWith()
       */
    });
    it("should return the cached response (prefix)", async () => {
      const cache = {
        get: vi.fn().mockResolvedValue(false),
        set: vi.fn().mockResolvedValue(false),
        del: vi.fn().mockResolvedValue(true),
        calculateTTL: vi.fn().mockReturnValue(10000),
        getCachedObject: vi.fn().mockResolvedValue({
          data: JSON.stringify({data: "data"})
        }),
        setCachedObject: vi.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        @UseCache({
          ttl: 10000,
          prefix: "TEST",
          refreshThreshold: 1000
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn();
      const $ctx = PlatformTest.createRequestContext();
      vi.spyOn($ctx.request, "get");
      vi.spyOn($ctx, "get").mockReturnValue(undefined);
      vi.spyOn($ctx.response, "getBody").mockReturnValue({
        data: "data"
      });
      vi.spyOn($ctx.response, "setHeaders").mockReturnThis();
      vi.spyOn($ctx.response, "onEnd").mockImplementation(() => $ctx.response);
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value", $ctx],
        options: {
          ttl: 10000,
          prefix: "TEST",
          refreshThreshold: 1000
        }
      };

      vi.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();
      vi.spyOn(interceptor as any, "sendResponse").mockResolvedValue(undefined);

      const result = await interceptor.cacheResponse(context, next);

      expect(cache.getCachedObject).toHaveBeenCalledWith("TEST:value");
      expect(result).toEqual(undefined);
      expect((interceptor as any).sendResponse).toHaveBeenCalledWith({data: '{"data":"data"}'});
      expect($ctx.request.get).toHaveBeenCalledWith("cache-control");

      /*
            console.log('$ctx.response.onEnd.mock.calls[0]', $ctx.response.onEnd.mock.calls[0])
      await $ctx.response.onEnd.mock.calls[0][0]()

      expect(cache.setCachedObject).toHaveBeenCalledWith()
       */
    });
    it("should bypass cached response when cache-control is no-cache", async () => {
      const cache = {
        get: vi.fn().mockResolvedValue(false),
        set: vi.fn().mockResolvedValue(false),
        del: vi.fn().mockResolvedValue(true),
        calculateTTL: vi.fn().mockReturnValue(10000),
        getCachedObject: vi.fn().mockResolvedValue({
          data: JSON.stringify({data: "cached"})
        }),
        setCachedObject: vi.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        @UseCache({
          ttl: 10000,
          refreshThreshold: 1000
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn().mockResolvedValue({data: "fresh"});
      const $ctx = PlatformTest.createRequestContext();
      vi.spyOn($ctx.request, "get").mockImplementation((key: string) => (key === "cache-control" ? "no-cache" : undefined));
      vi.spyOn($ctx, "get").mockReturnValue(undefined);
      vi.spyOn($ctx.response, "setHeaders").mockReturnThis();
      vi.spyOn($ctx.response, "onEnd").mockImplementation((cb) => {
        cb && cb();
        return $ctx.response;
      });
      vi.spyOn($ctx.response, "getBody").mockReturnValue({data: "fresh"});
      vi.spyOn($ctx.response, "getHeaders").mockReturnValue({
        "x-key": "key"
      });

      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value", $ctx],
        options: {
          ttl: 10000,
          refreshThreshold: 1000
        }
      };

      const sendResponseSpy = vi.spyOn(interceptor as any, "sendResponse").mockReturnValue(undefined);

      const result = await interceptor.cacheResponse(context, next);

      expect(cache.getCachedObject).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
      expect(sendResponseSpy).not.toHaveBeenCalled();
      expect($ctx.request.get).toHaveBeenCalledWith("cache-control");
      expect($ctx.response.setHeaders).toHaveBeenCalledWith({
        "cache-control": `max-age=10000`
      });
      expect(result).toEqual({data: "fresh"});
      expect(cache.setCachedObject).not.toHaveBeenCalled();
    });
    it("should ignore cache-control header when byPass is false", async () => {
      const cache = {
        get: vi.fn().mockResolvedValue(false),
        set: vi.fn().mockResolvedValue(false),
        del: vi.fn().mockResolvedValue(true),
        calculateTTL: vi.fn().mockReturnValue(10000),
        getCachedObject: vi.fn().mockResolvedValue({
          data: JSON.stringify({data: "data"})
        }),
        setCachedObject: vi.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        @UseCache({
          ttl: 10000,
          refreshThreshold: 1000,
          byPass: false
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn();
      const $ctx = PlatformTest.createRequestContext();
      vi.spyOn($ctx.request, "get").mockImplementation((key: string) => (key === "cache-control" ? "no-cache" : undefined));
      vi.spyOn($ctx, "get").mockReturnValue(undefined);
      vi.spyOn($ctx.response, "setHeaders").mockReturnThis();
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value", $ctx],
        options: {
          ttl: 10000,
          refreshThreshold: 1000,
          byPass: false
        }
      };

      vi.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();
      const sendResponseSpy = vi.spyOn(interceptor as any, "sendResponse").mockResolvedValue(undefined);

      await interceptor.cacheResponse(context, next);

      expect(cache.getCachedObject).toHaveBeenCalledWith("Test:test:value");
      expect(sendResponseSpy).toHaveBeenCalledWith({data: '{"data":"data"}'});
      expect(next).not.toHaveBeenCalled();
    });
    it("should call the method and set the cache", async () => {
      const cache = {
        get: vi.fn().mockResolvedValue(false),
        set: vi.fn().mockResolvedValue(false),
        del: vi.fn().mockResolvedValue(true),
        calculateTTL: vi.fn().mockReturnValue(10000),
        getCachedObject: vi.fn().mockResolvedValue(undefined),
        setCachedObject: vi.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        @UseCache({
          ttl: 10000,
          refreshThreshold: 1000
        })
        test(arg: string) {
          return "";
        }
      }

      const next = vi.fn();
      const $ctx = PlatformTest.createRequestContext();
      vi.spyOn($ctx.request, "get");
      vi.spyOn($ctx, "get").mockReturnValue(undefined);
      vi.spyOn($ctx.response, "getBody").mockReturnValue({
        data: "data"
      });
      vi.spyOn($ctx.response, "getHeaders").mockReturnValue({
        "x-key": "key"
      });
      vi.spyOn($ctx.response, "setHeaders").mockReturnThis();
      vi.spyOn($ctx.response, "onEnd").mockImplementation((cb) => {
        cb && cb();
        return $ctx.response;
      });
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value", $ctx],
        options: {
          ttl: 10000,
          refreshThreshold: 1000
        }
      };

      vi.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();
      vi.spyOn(interceptor as any, "sendResponse").mockResolvedValue(undefined);

      const result = await interceptor.cacheResponse(context, next);

      expect(cache.getCachedObject).toHaveBeenCalledWith("Test:test:value");
      expect(result).toEqual(undefined);
      expect($ctx.response.setHeaders).toHaveBeenCalledWith({
        "cache-control": `max-age=10000`
      });

      expect(cache.setCachedObject).toHaveBeenCalledWith(
        "Test:test:value",
        {data: "data"},
        {
          args: ["value"],
          headers: {"x-key": "key"},
          ttl: 10000
        }
      );
    });
  });
});
