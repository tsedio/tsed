import {PlatformTest} from "@tsed/common";
import {isClass} from "@tsed/core";
import {serialize} from "@tsed/json-mapper";
import {PlatformCache, PlatformCacheInterceptor} from "@tsed/platform-cache";

const defaultKeyResolver = (args: any[]) => {
  return args.map((arg: any) => (isClass(arg) ? JSON.stringify(serialize(arg)) : arg)).join(":");
};

describe("PlatformCacheInterceptor", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("intercept()", () => {
    it("should intercept the method and call endpoint cache method", async () => {
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: {
            disabled: jest.fn().mockReturnValue(false)
          }
        }
      ]);
      jest.spyOn(interceptor as any, "cacheMethod").mockResolvedValue("test");
      jest.spyOn(interceptor as any, "cacheResponse").mockResolvedValue("test");
      jest.spyOn(interceptor as any, "isEndpoint").mockReturnValue(true);

      const context: any = {};
      const next: any = jest.fn();

      await interceptor.intercept(context, next);

      expect((interceptor as any).cacheResponse).toHaveBeenCalledWith(context, next);
    });
    it("should intercept the method and call service cache method", async () => {
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: {
            disabled: jest.fn().mockReturnValue(false)
          }
        }
      ]);

      jest.spyOn(interceptor as any, "cacheMethod").mockResolvedValue("test");
      jest.spyOn(interceptor as any, "cacheResponse").mockResolvedValue("test");
      jest.spyOn(interceptor as any, "isEndpoint").mockReturnValue(false);

      const context: any = {};
      const next: any = jest.fn();

      await interceptor.intercept(context, next);

      expect((interceptor as any).cacheMethod).toHaveBeenCalledWith(context, next);
    });
    it("should do nothing when the cache is disabled", async () => {
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: {
            disabled: jest.fn().mockReturnValue(true)
          }
        }
      ]);

      jest.spyOn(interceptor as any, "cacheMethod").mockResolvedValue("test");
      jest.spyOn(interceptor as any, "cacheResponse").mockResolvedValue("test");
      jest.spyOn(interceptor as any, "isEndpoint").mockReturnValue(false);

      const context: any = {};
      const next: any = jest.fn();

      await interceptor.intercept(context, next);

      expect((interceptor as any).cacheResponse).not.toHaveBeenCalled();
      expect((interceptor as any).cacheMethod).not.toHaveBeenCalled();
    });
  });
  describe("canRefreshInBackground()", () => {
    it("should refresh key in background", async () => {
      const cache = {
        get: jest.fn().mockResolvedValue(false),
        set: jest.fn().mockResolvedValue(false),
        del: jest.fn().mockResolvedValue(true),
        ttl: jest.fn().mockResolvedValue(6999),
        calculateTTL: jest.fn().mockImplementation((result: any, ttl: any) => ttl)
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      const next = jest.fn();

      await interceptor.canRefreshInBackground("key", {refreshThreshold: 300, ttl: 10000}, next);

      expect(cache.get).toHaveBeenCalledWith("$$queue:key");
      expect(cache.set).toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
      expect(cache.del).toHaveBeenCalledWith("$$queue:key");
      expect(cache.ttl).toHaveBeenCalledWith("key");
      expect(next).toHaveBeenCalledWith();
    });
    it("should not refresh key in background", async () => {
      const cache = {
        get: jest.fn().mockResolvedValue(false),
        set: jest.fn().mockResolvedValue(false),
        del: jest.fn().mockResolvedValue(true),
        ttl: jest.fn().mockResolvedValue(9700),
        calculateTTL: jest.fn().mockImplementation((result: any, ttl: any) => ttl)
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      const next = jest.fn();

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
      const cache = {
        get: jest.fn().mockResolvedValue(false),
        set: jest.fn().mockResolvedValue(false),
        del: jest.fn().mockResolvedValue(true),
        calculateTTL: jest.fn().mockImplementation((result: any, ttl: any) => ttl),
        getCachedObject: jest.fn().mockResolvedValue({
          data: JSON.stringify({data: "data"})
        }),
        setCachedObject: jest.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        test(arg: string) {
          return "";
        }
      }

      const next = jest.fn().mockReturnValue({data: "refreshed"});
      const context: any = {
        target: Test,
        propertyKey: "test",
        args: ["value"],
        options: {
          ttl: 10000,
          refreshThreshold: 1000
        }
      };

      jest.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();

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
    it("should call the endpoint and cache the response", async () => {
      const cache = {
        get: jest.fn().mockResolvedValue(false),
        set: jest.fn().mockResolvedValue(false),
        del: jest.fn().mockResolvedValue(true),
        calculateTTL: jest.fn().mockImplementation((result: any, ttl: any) => ttl),
        getCachedObject: jest.fn().mockResolvedValue(undefined),
        setCachedObject: jest.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        test(arg: string) {
          return "";
        }
      }

      const next = jest.fn().mockResolvedValue({
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

      jest.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();

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
    it("should catch and log error", async () => {
      const cache = {
        get: jest.fn().mockResolvedValue(false),
        set: jest.fn().mockResolvedValue(false),
        del: jest.fn().mockResolvedValue(true),
        calculateTTL: jest.fn().mockImplementation((result: any, ttl: any) => ttl),
        getCachedObject: jest.fn().mockResolvedValue({data: JSON.stringify({})}),
        setCachedObject: jest.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };

      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        test(arg: string) {
          return "";
        }
      }

      const next = jest.fn().mockResolvedValue({
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
      jest.spyOn(interceptor, "canRefreshInBackground").mockRejectedValue(error);
      jest.spyOn((interceptor as any).logger, "error");

      await interceptor.cacheMethod(context, next);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect((interceptor as any).logger.error).toHaveBeenCalledWith({
        error,
        event: "CACHE_ERROR",
        method: "cacheMethod"
      });
    });
  });
  describe("cacheResponse()", () => {
    it("should return the cached response", async () => {
      const cache = {
        get: jest.fn().mockResolvedValue(false),
        set: jest.fn().mockResolvedValue(false),
        del: jest.fn().mockResolvedValue(true),
        calculateTTL: jest.fn().mockReturnValue(10000),
        getCachedObject: jest.fn().mockResolvedValue({
          data: JSON.stringify({data: "data"})
        }),
        setCachedObject: jest.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        test(arg: string) {
          return "";
        }
      }

      const next = jest.fn();
      const $ctx = {
        request: {
          method: "GET",
          get: jest.fn()
        },
        response: {
          getBody: jest.fn().mockReturnValue({
            data: "data"
          }),
          setHeaders: jest.fn(),
          onEnd: jest.fn()
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

      jest.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();
      jest.spyOn(interceptor as any, "sendResponse").mockResolvedValue(undefined);

      const result = await interceptor.cacheResponse(context, next);

      expect(cache.getCachedObject).toHaveBeenCalledWith('GET::value:{"request":{"method":"GET"},"response":{}}');
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
        get: jest.fn().mockResolvedValue(false),
        set: jest.fn().mockResolvedValue(false),
        del: jest.fn().mockResolvedValue(true),
        calculateTTL: jest.fn().mockReturnValue(10000),
        getCachedObject: jest.fn().mockResolvedValue(undefined),
        setCachedObject: jest.fn().mockResolvedValue("test"),
        defaultKeyResolver: () => defaultKeyResolver
      };
      const interceptor = await PlatformTest.invoke<PlatformCacheInterceptor>(PlatformCacheInterceptor, [
        {
          token: PlatformCache,
          use: cache
        }
      ]);

      class Test {
        test(arg: string) {
          return "";
        }
      }

      const next = jest.fn();
      const $ctx = {
        request: {
          method: "GET",
          url: "/",
          get: jest.fn()
        },
        response: {
          getBody: jest.fn().mockReturnValue({
            data: "data"
          }),
          getHeaders: jest.fn().mockReturnValue({
            "x-key": "key"
          }),
          setHeaders: jest.fn(),
          onEnd: jest.fn()
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

      jest.spyOn(interceptor, "canRefreshInBackground").mockResolvedValue();
      jest.spyOn(interceptor as any, "sendResponse").mockResolvedValue(undefined);

      const result = await interceptor.cacheResponse(context, next);

      expect(cache.getCachedObject).toHaveBeenCalledWith('GET:/:value:{"request":{"method":"GET","url":"/"},"response":{}}');
      expect(result).toEqual(undefined);
      expect($ctx.response.setHeaders).toHaveBeenCalledWith({
        "cache-control": `max-age=10000`
      });

      await $ctx.response.onEnd.mock.calls[0][0]();

      expect(cache.setCachedObject).toHaveBeenCalledWith(
        'GET:/:value:{"request":{"method":"GET","url":"/"},"response":{}}',
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
