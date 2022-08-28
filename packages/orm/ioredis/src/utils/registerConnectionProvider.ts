import {setValue} from "@tsed/core";
import {Configuration, registerProvider, TokenProvider} from "@tsed/di";
import {Logger} from "@tsed/logger";
import Redis, {Cluster, RedisOptions} from "ioredis";
import {IORedisConfiguration} from "../domain/IORedisConfiguration";
import {ioRedisStore} from "../domain/IORedisStore";

export interface CreateConnectionProviderProps {
  provide: TokenProvider;
  name?: string;
}

export const IOREDIS_CONNECTIONS = Symbol.for("ioredis:connections");
export type IORedis = Redis & {name: string};

export function registerConnectionProvider({provide, name = "default"}: CreateConnectionProviderProps) {
  registerProvider({
    provide,
    type: IOREDIS_CONNECTIONS,
    connectionName: name,
    deps: [Configuration, Logger],
    async useAsyncFactory(configuration: Configuration, logger: Logger) {
      const items = configuration.get<IORedisConfiguration[]>("ioredis", []);
      const item = items.find((item) => item.name === name);

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

          const clusterRetryStrategy = (times: number) => {
            logger.fatal({event: "REDIS_ERROR", message: `Redis is not responding - Retry count: ${times}`});
            return 2000;
          };

          setValue(clusterOptions, "clusterRetryStrategy", clusterRetryStrategy);
          setValue(clusterOptions, "redisOptions.reconnectOnError", reconnectOnError);

          connection = new Redis.Cluster(nodes, {
            ...clusterOptions,
            lazyConnect: true
          });
        } else {
          connection = new Redis({
            ...redisOptions,
            lazyConnect: true,
            reconnectOnError
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
