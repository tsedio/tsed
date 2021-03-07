import {PlatformTest} from "@tsed/common";
import cacheManager from "cache-manager";
import {expect} from "chai";
import Sinon from "sinon";
import {PlatformCache} from "./PlatformCache";

const sandbox = Sinon.createSandbox();

function createCacheFixture() {
  const map = new Map();
  return {
    get: sandbox.stub().callsFake((key) => {
      return Promise.resolve(map.get(key));
    }),
    set: sandbox.stub().callsFake((key, value) => {
      return Promise.resolve(map.set(key, value));
    }),
    wrap: sandbox.stub().callsFake((key, fn) => {
      return fn();
    }),
    reset: sandbox.stub().callsFake(() => {
      map.clear();
    }),
    del: sandbox.stub().callsFake((key) => {
      map.delete(key);
    })
  };
}

describe("PlatformCache", () => {
  describe("with single cache", () => {
    let caching: ReturnType<typeof createCacheFixture>;

    beforeEach(() => {
      caching = createCacheFixture();
      sandbox.stub(cacheManager, "caching").returns(caching as any);
      return PlatformTest.create({
        cache: {
          store: "memory",
          ttl: 300
        }
      });
    });
    afterEach(() => {
      sandbox.restore();
      return PlatformTest.reset();
    });

    it("should create single cache", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      await cacheManager.set("key", "value");
      await cacheManager.set("key2", "value2");
      expect(await cacheManager.get("key")).to.equal("value");
      expect(await cacheManager.get("key2")).to.equal("value2");

      await cacheManager.del("key2");

      expect(await cacheManager.get("key2")).to.equal(undefined);

      await cacheManager.reset();

      expect(await cacheManager.get("key")).to.equal(undefined);

      const result = await cacheManager.wrap("key", async () => {
        return "valuePromised";
      });

      expect(result).to.equal("valuePromised");
    });

    it("should return the calculated ttl", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      expect(cacheManager.ttl({}, 400)).to.equal(400);
      expect(cacheManager.ttl({}, () => 200)).to.equal(200);
      expect(cacheManager.ttl({})).to.equal(300);
      expect(cacheManager.ttl()).to.equal(300);
    });
  });
  describe("with multiple cache", () => {
    let caching: ReturnType<typeof createCacheFixture>;
    beforeEach(() => {
      caching = createCacheFixture();
      sandbox.stub(cacheManager, "multiCaching").returns(caching as any);
      return PlatformTest.create({
        cache: {
          caches: [{}, {}] as any[],
          ttl: 300
        }
      });
    });
    afterEach(() => {
      sandbox.restore();
      return PlatformTest.reset();
    });

    it("should create multiple cache", async () => {
      const cacheManager = PlatformTest.get<PlatformCache>(PlatformCache);

      await cacheManager.set("key", "value");
      await cacheManager.set("key2", "value2");
      expect(await cacheManager.get("key")).to.equal("value");
      expect(await cacheManager.get("key2")).to.equal("value2");

      await cacheManager.del("key2");

      expect(await cacheManager.get("key2")).to.equal(undefined);

      await cacheManager.reset();

      expect(await cacheManager.get("key")).to.equal(undefined);

      const result = await cacheManager.wrap("key", async () => {
        return "valuePromised";
      });

      expect(result).to.equal("valuePromised");
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

      await cacheManager.set("key", "value");
      await cacheManager.set("key2", "value2");
      expect(await cacheManager.get("key")).to.equal(undefined);
      expect(await cacheManager.get("key2")).to.equal(undefined);

      await cacheManager.del("key2");

      expect(await cacheManager.get("key2")).to.equal(undefined);

      await cacheManager.reset();

      expect(await cacheManager.get("key")).to.equal(undefined);

      const result = await cacheManager.wrap("key", async () => {
        return "valuePromised";
      });

      expect(result).to.equal("valuePromised");
    });
  });
});
