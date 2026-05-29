import {RedisContainer, StartedRedisContainer} from "@testcontainers/redis";

const KEY = "TEST_CONTAINER_REDIS";

function getGlobal<T>(key: string): T | null {
  // @ts-ignore
  return global[key];
}

function setGlobal(key: string, environment: unknown) {
  // @ts-ignore
  global[key] = environment;
}

export class TestContainersRedis {
  static createContainer(image = "redis:8.0.1") {
    return new RedisContainer(image).start();
  }

  static async startContainer(image?: string) {
    // await stopMockServer()
    const container = getGlobal<StartedRedisContainer>(KEY) || (await this.createContainer(image));

    setGlobal(KEY, container);

    process.env.REDIS_URL = container.getConnectionUrl();

    return {
      container,
      url: process.env.REDIS_URL
    };
  }

  static async stopContainer() {
    const container = getGlobal<StartedRedisContainer>(KEY);

    process.stdout.write("Stopping redis database\n");

    if (container) {
      await this.reset();
      await container.stop();
    }
  }

  static async reset() {
    const container = getGlobal<StartedRedisContainer>(KEY);
    await container?.exec("redis-cli flushall");
  }

  static getUrl(): string {
    return process.env.REDIS_URL as string;
  }

  static getRedisOptions() {
    const url = new URL(this.getUrl());
    return {
      host: url.hostname,
      password: url.password,
      port: url.port ? Number(url.port) : 6379,
      username: url.username,
      tls:
        url.protocol === "rediss:"
          ? {
              rejectUnauthorized: false
            }
          : undefined
    };
  }
}
