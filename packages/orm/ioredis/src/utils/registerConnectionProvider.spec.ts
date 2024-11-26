import {configuration, DITest} from "@tsed/di";
import {Redis} from "ioredis";

import {registerConnectionProvider} from "./registerConnectionProvider.js";

vi.mock("ioredis", () => {
  class MockRedis {
    static Cluster = class {
      connector: any = {};

      constructor(
        public nodes: any,
        public options: any
      ) {
        this.connector.options = options;
      }

      connect() {
        return Promise.resolve(undefined);
      }

      disconnect() {
        return Promise.resolve(undefined);
      }
    };
    connector: any = {};

    constructor(public options: any) {
      this.connector.options = options;
    }

    connect() {
      return Promise.resolve(undefined);
    }

    disconnect() {
      return Promise.resolve(undefined);
    }
  }

  return {Redis: MockRedis, default: {Redis: MockRedis}};
});

const REDIS_CONNECTION = Symbol.for("REDIS_CONNECTION");
type REDIS_CONNECTION = Redis;

registerConnectionProvider({token: REDIS_CONNECTION, name: "default"});

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
      const cacheSettings = configuration().get("cache");

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
      const cacheSettings = configuration().get("cache");

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
            sentinelName: "sentinelName",
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
      const cacheSettings = configuration().get("cache");

      expect((connection as any).options).toMatchObject({
        value: "value",
        lazyConnect: true
      });
      expect((connection as any).options.sentinels).toEqual([]);
      expect((connection as any).options.name).toEqual("sentinelName");
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
