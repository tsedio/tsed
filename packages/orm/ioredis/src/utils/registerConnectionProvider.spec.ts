import {DITest} from "@tsed/di";
import Redis from "ioredis";
import {registerConnectionProvider} from "./registerConnectionProvider";

jest.mock("ioredis", () => {
  class MockRedis {
    static Cluster = class {
      connector: any = {};

      constructor(public nodes: any, public options: any) {
        this.connector.options = options;
      }

      async connect() {
        return undefined;
      }

      async disconnect() {
        return undefined;
      }
    };
    connector: any = {};

    constructor(public options: any) {
      this.connector.options = options;
    }

    async connect() {
      return undefined;
    }

    async disconnect() {
      return undefined;
    }
  }

  return MockRedis;
});

const REDIS_CONNECTION = Symbol.for("REDIS_CONNECTION");
type REDIS_CONNECTION = Redis;

registerConnectionProvider({provide: REDIS_CONNECTION, name: "default"});

describe("RedisConnection", () => {
  describe("Redis", () => {
    beforeEach(() =>
      DITest.create({
        ioredis: [
          {
            name: "default",
            host: "localhost",
            cache: true
          }
        ],
        cache: {} as any
      })
    );
    afterEach(() => DITest.reset());

    it("should create redis connection", () => {
      const connection = DITest.get<REDIS_CONNECTION>(REDIS_CONNECTION);
      const cacheSettings = DITest.injector.settings.get("cache");

      expect((connection as any).options).toMatchObject({
        host: "localhost",
        lazyConnect: true,
        reconnectOnError: expect.any(Function)
      });
      expect(cacheSettings.redisInstance).toEqual(connection);
    });
  });
  describe("Cluster", () => {
    beforeEach(() =>
      DITest.create({
        ioredis: [
          {
            name: "default",
            cache: true,
            nodes: [],
            redisOptions: {},
            value: "value"
          } as any
        ],
        cache: {} as any
      })
    );
    afterEach(() => DITest.reset());

    it("should create redis connection", () => {
      const connection = DITest.get<REDIS_CONNECTION>(REDIS_CONNECTION);
      const cacheSettings = DITest.injector.settings.get("cache");

      expect((connection as any).options).toMatchObject({
        clusterRetryStrategy: expect.any(Function),
        value: "value",
        lazyConnect: true,
        redisOptions: {
          reconnectOnError: expect.any(Function)
        }
      });
      expect((connection as any).nodes).toEqual([]);
      expect(cacheSettings.redisInstance).toEqual(connection);

      (connection as any).options.clusterRetryStrategy();
      (connection as any).options.redisOptions.reconnectOnError();
    });
  });
  describe("Sentinel", () => {
    beforeEach(() =>
      DITest.create({
        ioredis: [
          {
            name: "default",
            cache: true,
            sentinels: [],
            redisOptions: {},
            value: "value"
          } as any
        ],
        cache: {} as any
      })
    );
    afterEach(() => DITest.reset());

    it("should create redis connection", () => {
      const connection = DITest.get<REDIS_CONNECTION>(REDIS_CONNECTION);
      const cacheSettings = DITest.injector.settings.get("cache");

      expect((connection as any).options).toMatchObject({
        value: "value",
        lazyConnect: true
      });
      expect((connection as any).sentinels).toEqual([]);
      expect(cacheSettings.redisInstance).toEqual(connection);

      (connection as any).options.sentinelRetryStrategy();
    });
  });
  describe("Disabled connection", () => {
    beforeEach(() =>
      DITest.create({
        ioredis: [],
        cache: {} as any
      })
    );
    afterEach(() => DITest.reset());

    it("should create redis connection", () => {
      const connection = DITest.get<REDIS_CONNECTION>(REDIS_CONNECTION);

      expect(connection).toEqual({
        name: "default"
      });
    });
  });
});
