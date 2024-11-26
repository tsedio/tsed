import {setValue} from "@tsed/core";
import {Configuration, registerProvider, TokenProvider} from "@tsed/di";
import {Logger} from "@tsed/logger";
import type {Cluster, Redis, RedisOptions} from "ioredis";
import ioredis from "ioredis";

import {IORedisConfiguration} from "../domain/IORedisConfiguration.js";
import {ioRedisStore} from "../domain/IORedisStore.js";

export interface CreateConnectionProviderProps {
  token: TokenProvider;
  name?: string;
}

export const IOREDIS_CONNECTIONS = Symbol.for("ioredis:connections");
export type IORedis = Redis & {name: string};

export function registerConnectionProvider({token, name = "default"}: CreateConnectionProviderProps) {
  registerProvider({
    token,
    type: IOREDIS_CONNECTIONS,
    connectionName: name,
    deps: [Configuration, Logger],
    async useAsyncFactory(configuration: Configuration, logger: Logger) {
      const items = configuration.get<IORedisConfiguration[]>("ioredis", []);
      const item = items.find((item) => item.name === name);
      const retryStrategy = (times: number) => {
        logger.fatal({event: "REDIS_ERROR", message: `Redis is not responding - Retry count: ${times}`});
        return 2000;
      };

      if (item) {
        const {name, cache, ...redisOptions} = item;
        let connection: Cluster | Redis;

        const reconnectOnError = (err: any) => {
          logger.fatal({
            event: "REDIS_ERROR",
            message: `Redis - Reconnect on error: ${(err && err.message) || err}`,
            stack: err?.stack
          });
        };

        if ("nodes" in redisOptions) {
          const {nodes, ...clusterOptions} = redisOptions;

          setValue(clusterOptions, "clusterRetryStrategy", retryStrategy);
          setValue(clusterOptions, "redisOptions.reconnectOnError", reconnectOnError);

          connection = new ioredis.Redis.Cluster(nodes, {
            ...clusterOptions,
            lazyConnect: true
          });
        } else if ("sentinels" in redisOptions) {
          const {sentinels, sentinelName = name, ...sentinelsOptions} = redisOptions;

          setValue(sentinelsOptions, "sentinelRetryStrategy", retryStrategy);
          setValue(sentinelsOptions, "redisOptions.reconnectOnError", reconnectOnError);

          connection = new ioredis.Redis({
            name: String(sentinelName),
            sentinels,
            ...sentinelsOptions,
            lazyConnect: true
          });
        } else {
          connection = new ioredis.Redis({
            reconnectOnError,
            ...redisOptions,
            lazyConnect: true
          } as RedisOptions);
        }

        await connection.connect();

        logger.info("Connected to redis database...");

        if (configuration.get("cache") && cache) {
          configuration.set("cache.redisInstance", connection);
          configuration.set("cache.store", ioRedisStore);
        }

        (connection as any).name = name;

        return connection;
      }

      return {name};
    },
    hooks: {
      $onDestroy(connection: Redis) {
        return connection.disconnect && connection.disconnect();
      }
    }
  });
}
