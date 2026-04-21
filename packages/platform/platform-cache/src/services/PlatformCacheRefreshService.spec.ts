import {PlatformTest} from "@tsed/platform-http/testing";

import {PlatformCache} from "./PlatformCache.js";
import {PlatformCacheRefreshService} from "./PlatformCacheRefreshService.js";

function createPlatformCacheMock() {
  const store = new Map<string, any>();

  return {
    get: vi.fn().mockImplementation((key: string) => Promise.resolve(store.get(key))),
    set: vi.fn().mockImplementation((key: string, value: any) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    del: vi.fn().mockImplementation((key: string) => {
      store.delete(key);
      return Promise.resolve();
    }),
    buildInternalKey: (namespace: "queue" | "refresh-cooldown", key: string) => `$$${namespace}:${key}`
  };
}

describe("PlatformCacheRefreshService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should manage queue markers", async () => {
    const cache = createPlatformCacheMock();
    const service = await PlatformTest.invoke<PlatformCacheRefreshService>(PlatformCacheRefreshService, [
      {
        token: PlatformCache,
        use: cache
      }
    ]);

    expect(await service.hasKeyInQueue("key")).toBe(false);

    await service.addKeyToQueue("key");

    expect(cache.set).toHaveBeenCalledWith("$$queue:key", true, {ttl: 120});
    expect(await service.hasKeyInQueue("key")).toBe(true);

    await service.deleteKeyFromQueue("key");

    expect(cache.del).toHaveBeenCalledWith("$$queue:key");
    expect(await service.hasKeyInQueue("key")).toBe(false);
  });

  it("should manage refresh cooldown markers", async () => {
    const cache = createPlatformCacheMock();
    const service = await PlatformTest.invoke<PlatformCacheRefreshService>(PlatformCacheRefreshService, [
      {
        token: PlatformCache,
        use: cache
      }
    ]);

    expect(await service.hasRefreshCooldown("key")).toBe(false);

    await service.addRefreshCooldown("key", 9);

    expect(cache.set).toHaveBeenCalledWith("$$refresh-cooldown:key", true, {ttl: 4});
    expect(await service.hasRefreshCooldown("key")).toBe(true);

    await service.addRefreshCooldown("small", 1);
    expect(cache.set).toHaveBeenCalledWith("$$refresh-cooldown:small", true, {ttl: 1});
  });

  it("should calculate a deterministic jittered threshold", () => {
    const service = new PlatformCacheRefreshService();

    const result1 = service.getRefreshThresholdWithJitter("key", 300);
    const result2 = service.getRefreshThresholdWithJitter("key", 300);

    expect(result1).toBe(result2);
    expect(result1).toBeGreaterThanOrEqual(270);
    expect(result1).toBeLessThanOrEqual(300);
  });

  it("should serialize refresh locks per key", async () => {
    const service = new PlatformCacheRefreshService();

    const release1 = await service.acquireRefreshLock("key");

    let acquiredSecond = false;
    const waitSecond = service.acquireRefreshLock("key").then((release2) => {
      acquiredSecond = true;
      return release2;
    });

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(acquiredSecond).toBe(false);

    release1();
    const release2 = await waitSecond;

    expect(acquiredSecond).toBe(true);
    release2();
  });

  it("should support idempotent lock release", async () => {
    const service = new PlatformCacheRefreshService();

    const release = await service.acquireRefreshLock("key");
    release();
    release();

    const release2 = await service.acquireRefreshLock("key");
    release2();
  });
});
