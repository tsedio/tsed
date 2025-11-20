import {getCache, getCacheValue, setCacheValue} from "@directus/api/cache";
import type {InterceptorContext} from "@tsed/di";
import {DITest} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {DirectusCacheInterceptor, type DirectusCacheOptions} from "./DirectusCacheInterceptor.js";

vi.mock("@directus/api/cache", () => ({
  getCache: vi.fn(),
  getCacheValue: vi.fn(),
  setCacheValue: vi.fn()
}));

async function getFixture() {
  const mockCache = {};
  const mockSystemCache = {};

  vi.mocked(getCache).mockReturnValue({
    cache: mockCache,
    systemCache: mockSystemCache
  } as any);

  vi.mocked(getCacheValue).mockResolvedValue(undefined);
  vi.mocked(setCacheValue).mockResolvedValue(undefined);

  const interceptor = await DITest.invoke(DirectusCacheInterceptor);

  const mockContext: InterceptorContext<any, DirectusCacheOptions> = {
    target: class TestClass {},
    propertyKey: "testMethod",
    args: [],
    options: {},
    next: vi.fn().mockResolvedValue("result")
  } as any;

  return {
    interceptor,
    mockContext,
    mockCache,
    mockSystemCache
  };
}

describe("DirectusCacheInterceptor", () => {
  beforeEach(() => DITest.create());
  afterEach(() => {
    DITest.reset();
    vi.clearAllMocks();
  });

  describe("Cache key generation", () => {
    it("should generate cache key with default namespace and no args", async () => {
      const {interceptor, mockContext, mockSystemCache} = await getFixture();

      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, "test_class:testMethod:", "result", 900000);
    });

    it("should generate cache key with arguments", async () => {
      const {interceptor, mockContext, mockSystemCache} = await getFixture();
      mockContext.args = ["arg1", 123, {key: "value"}];

      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, 'test_class:testMethod:["arg1",123,{"key":"value"}]', "result", 900000);
    });

    it("should use custom namespace when provided", async () => {
      const {interceptor, mockContext, mockSystemCache} = await getFixture();
      mockContext.options = {
        namespace: "custom:namespace"
      };

      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, "custom:namespace:", "result", 900000);
    });

    it("should use custom key generator when provided", async () => {
      const {interceptor, mockContext, mockSystemCache} = await getFixture();
      mockContext.options = {
        keyGenerator: (...args: unknown[]) => `custom-key-${args.length}`
      };
      mockContext.args = ["arg1", "arg2"];

      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, "test_class:testMethod:custom-key-2", "result", 900000);
    });
  });

  describe("Cache retrieval", () => {
    it("should return cached value when available", async () => {
      const cachedValue = {data: "cached"};
      const {interceptor, mockContext} = await getFixture();
      vi.mocked(getCacheValue).mockResolvedValue(cachedValue);

      const result = await interceptor.intercept(mockContext);

      expect(result).toEqual(cachedValue);
      expect(mockContext.next).not.toHaveBeenCalled();
      expect(setCacheValue).not.toHaveBeenCalled();
    });

    it("should execute function when cache is empty", async () => {
      const {interceptor, mockContext} = await getFixture();

      const result = await interceptor.intercept(mockContext);

      expect(mockContext.next).toHaveBeenCalled();
      expect(result).toBe("result");
    });

    it("should handle cached null value", async () => {
      const {interceptor, mockContext} = await getFixture();
      vi.mocked(getCacheValue).mockResolvedValue(null);

      const result = await interceptor.intercept(mockContext);

      expect(result).toBeNull();
      expect(mockContext.next).not.toHaveBeenCalled();
    });

    it("should handle cached false value", async () => {
      const {interceptor, mockContext} = await getFixture();
      vi.mocked(getCacheValue).mockResolvedValue(false);

      const result = await interceptor.intercept(mockContext);

      expect(result).toBe(false);
      expect(mockContext.next).not.toHaveBeenCalled();
    });

    it("should handle cached zero value", async () => {
      const {interceptor, mockContext} = await getFixture();
      vi.mocked(getCacheValue).mockResolvedValue(0);

      const result = await interceptor.intercept(mockContext);

      expect(result).toBe(0);
      expect(mockContext.next).not.toHaveBeenCalled();
    });

    it("should handle cached empty string value", async () => {
      const {interceptor, mockContext} = await getFixture();
      vi.mocked(getCacheValue).mockResolvedValue("");

      const result = await interceptor.intercept(mockContext);

      expect(result).toBe("");
      expect(mockContext.next).not.toHaveBeenCalled();
    });
  });

  describe("Cache storage", () => {
    it("should cache result with default TTL", async () => {
      const {interceptor, mockContext, mockSystemCache} = await getFixture();

      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, "test_class:testMethod:", "result", 900000);
    });

    it("should cache result with custom TTL", async () => {
      const {interceptor, mockContext, mockSystemCache} = await getFixture();
      mockContext.options = {
        ttl: 60000
      };

      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, "test_class:testMethod:", "result", 60000);
    });

    it("should cache complex objects", async () => {
      const complexResult = {
        items: [1, 2, 3],
        metadata: {total: 3},
        nested: {deep: {value: "test"}}
      };
      const {interceptor, mockContext, mockSystemCache} = await getFixture();
      mockContext.next = vi.fn().mockResolvedValue(complexResult);

      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, "test_class:testMethod:", complexResult, 900000);
    });

    it("should cache arrays", async () => {
      const arrayResult = ["item1", "item2", "item3"];
      const {interceptor, mockContext, mockSystemCache} = await getFixture();
      mockContext.next = vi.fn().mockResolvedValue(arrayResult);

      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, "test_class:testMethod:", arrayResult, 900000);
    });
  });

  describe("Cache selection", () => {
    it("should use system cache by default", async () => {
      const {interceptor, mockContext, mockSystemCache} = await getFixture();

      await interceptor.intercept(mockContext);

      expect(getCacheValue).toHaveBeenCalledWith(mockSystemCache, "test_class:testMethod:");
      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, "test_class:testMethod:", "result", 900000);
    });

    it("should use regular cache when useSystemCache is false", async () => {
      const {interceptor, mockContext, mockCache} = await getFixture();
      mockContext.options = {
        useSystemCache: false
      };

      await interceptor.intercept(mockContext);

      expect(getCacheValue).toHaveBeenCalledWith(mockCache, "test_class:testMethod:");
      expect(setCacheValue).toHaveBeenCalledWith(mockCache, "test_class:testMethod:", "result", 900000);
    });

    it("should use system cache when explicitly set to true", async () => {
      const {interceptor, mockContext, mockSystemCache} = await getFixture();
      mockContext.options = {
        useSystemCache: true
      };

      await interceptor.intercept(mockContext);

      expect(getCacheValue).toHaveBeenCalledWith(mockSystemCache, "test_class:testMethod:");
    });
  });

  describe("Error handling", () => {
    it("should propagate errors from next function", async () => {
      const error = new Error("Function execution failed");
      const {interceptor, mockContext} = await getFixture();
      mockContext.next = vi.fn().mockRejectedValue(error);

      await expect(interceptor.intercept(mockContext)).rejects.toThrow("Function execution failed");
      expect(setCacheValue).not.toHaveBeenCalled();
    });

    it("should propagate errors from cache retrieval", async () => {
      const error = new Error("Cache retrieval failed");
      const {interceptor, mockContext} = await getFixture();
      vi.mocked(getCacheValue).mockRejectedValue(error);

      await expect(interceptor.intercept(mockContext)).rejects.toThrow("Cache retrieval failed");
      expect(mockContext.next).not.toHaveBeenCalled();
    });
  });

  describe("Integration scenarios", () => {
    it("should cache different results for different arguments", async () => {
      const {interceptor, mockContext, mockSystemCache} = await getFixture();

      // First call with args1
      mockContext.args = ["user", "123"];
      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, 'test_class:testMethod:["user","123"]', "result", 900000);

      vi.clearAllMocks();
      vi.mocked(getCacheValue).mockResolvedValue(undefined);

      // Second call with different args
      mockContext.args = ["user", "456"];
      await interceptor.intercept(mockContext);

      expect(setCacheValue).toHaveBeenCalledWith(mockSystemCache, 'test_class:testMethod:["user","456"]', "result", 900000);
    });

    it("should work with all options combined", async () => {
      const {interceptor, mockContext, mockCache} = await getFixture();
      mockContext.options = {
        ttl: 30000,
        keyGenerator: (id: string) => `id:${id}`,
        namespace: "custom:service",
        useSystemCache: false
      };
      mockContext.args = ["abc123"];

      await interceptor.intercept(mockContext);

      expect(getCacheValue).toHaveBeenCalledWith(mockCache, "custom:service:id:abc123");
      expect(setCacheValue).toHaveBeenCalledWith(mockCache, "custom:service:id:abc123", "result", 30000);
    });
  });
});
