import {isClass} from "@tsed/core";
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

      const next = vi.fn();

      await interceptor.canRefreshInBackground("key", {refreshThreshold: 300, ttl: 10000}, next);

      expect(cache.get).toHaveBeenCalledWith("$$queue:key");
      expect(cache.set).toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
      expect(cache.del).toHaveBeenCalledWith("$$queue:key");
      expect(cache.ttl).toHaveBeenCalledWith("key");
      expect(next).toHaveBeenCalledWith();
    });
    it("should not refresh key in background", async () => {
      const {cache, interceptor} = await getInterceptorFixture({
        ttl: 9700
      });

      const next = vi.fn();

      await interceptor.canRefreshInBackground("key", {refreshThreshold: 300, ttl: 10000}, next);

      expect(cache.get).toHaveBeenCalledWith("$$queue:key");
      expect(cache.ttl).toHaveBeenCalledWith("key");
      expect(cache.set).toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
      expect(cache.del).toHaveBeenCalledWith("$$queue:key");
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe("cacheMethod()", () => {
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
      vi.spyOn((interceptor as any).logger, "error");

      await interceptor.cacheMethod(context, next);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect((interceptor as any).logger.error).toHaveBeenCalledWith({
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
      const $ctx = {
        request: {
          method: "GET",
          url: "/",
          get: vi.fn()
        },
        response: {
          getBody: vi.fn().mockReturnValue({
            data: "data"
          }),
          setHeaders: vi.fn(),
          onEnd: vi.fn()
        }
      };
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

      expect(cache.getCachedObject).toHaveBeenCalledWith('Test:test:value:{"request":{"method":"GET","url":"/"},"response":{}}');
      expect(result).toEqual(undefined);
      expect((interceptor as any).sendResponse).toHaveBeenCalledWith({data: '{"data":"data"}'}, $ctx);
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
      const $ctx = {
        request: {
          method: "GET",
          url: "/",
          get: vi.fn()
        },
        response: {
          getBody: vi.fn().mockReturnValue({
            data: "data"
          }),
          setHeaders: vi.fn(),
          onEnd: vi.fn()
        }
      };
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

      expect(cache.getCachedObject).toHaveBeenCalledWith('TEST:value:{"request":{"method":"GET","url":"/"},"response":{}}');
      expect(result).toEqual(undefined);
      expect((interceptor as any).sendResponse).toHaveBeenCalledWith({data: '{"data":"data"}'}, $ctx);
      expect($ctx.request.get).toHaveBeenCalledWith("cache-control");

      /*
            console.log('$ctx.response.onEnd.mock.calls[0]', $ctx.response.onEnd.mock.calls[0])
      await $ctx.response.onEnd.mock.calls[0][0]()

      expect(cache.setCachedObject).toHaveBeenCalledWith()
       */
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
      const $ctx = {
        request: {
          method: "GET",
          url: "/",
          get: vi.fn()
        },
        response: {
          getBody: vi.fn().mockReturnValue({
            data: "data"
          }),
          getHeaders: vi.fn().mockReturnValue({
            "x-key": "key"
          }),
          setHeaders: vi.fn(),
          onEnd: vi.fn()
        }
      };
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

      expect(cache.getCachedObject).toHaveBeenCalledWith('Test:test:value:{"request":{"method":"GET","url":"/"},"response":{}}');
      expect(result).toEqual(undefined);
      expect($ctx.response.setHeaders).toHaveBeenCalledWith({
        "cache-control": `max-age=10000`
      });

      await $ctx.response.onEnd.mock.calls[0][0]();

      expect(cache.setCachedObject).toHaveBeenCalledWith(
        'Test:test:value:{"request":{"method":"GET","url":"/"},"response":{}}',
        {data: "data"},
        {
          args: ["value", {request: {method: "GET", url: "/"}, response: {}}],
          headers: {"x-key": "key"},
          ttl: 10000
        }
      );
    });
  });
});
