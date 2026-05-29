import {configuration, DITest} from "@tsed/di";
import type {RedisClientType} from "redis";

import {registerConnectionProvider} from "./registerConnectionProvider.js";

vi.mock("redis", () => {
  const createClient = vi.fn((options: any) => ({
    options,
    on: vi.fn(),
    connect: vi.fn(() => Promise.resolve()),
    disconnect: vi.fn(() => Promise.resolve())
  }));
  const createCluster = vi.fn((options: any) => ({
    options,
    connect: vi.fn(() => Promise.resolve()),
    disconnect: vi.fn(() => Promise.resolve())
  }));

  return {createClient, createCluster};
});

const REDIS_CONNECTION = Symbol.for("REDIS_CONNECTION");
type REDIS_CONNECTION = RedisClientType;

registerConnectionProvider({token: REDIS_CONNECTION, name: "default"});

describe("RedisConnection", () => {
  describe("Redis", () => {
    beforeEach(() =>
      DITest.create({
        redis: [
          {
            name: "default",
            socket: {
              host: "localhost"
            },
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

      expect((connection as any).options.socket.host).toEqual("localhost");
      expect(cacheSettings.redisInstance).toEqual(connection);
    });
  });

  describe("Cluster", () => {
    beforeEach(() =>
      DITest.create({
        redis: [
          {
            name: "default",
            cache: true,
            nodes: []
          } as any
        ],
        cache: {} as any
      })
    );
    afterEach(() => DITest.reset());

    it("should create redis cluster connection", () => {
      const connection = DITest.get<REDIS_CONNECTION>(REDIS_CONNECTION);
      const cacheSettings = configuration().get("cache");

      expect((connection as any).options.rootNodes).toEqual([]);
      expect(cacheSettings.redisInstance).toEqual(connection);
    });
  });

  describe("Disabled connection", () => {
    beforeEach(() =>
      DITest.create({
        redis: [],
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
