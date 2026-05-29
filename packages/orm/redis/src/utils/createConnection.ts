import {configuration, logger} from "@tsed/di";
import {createClient, createCluster, type RedisClientType, type RedisClusterType} from "redis";

import {RedisConfiguration} from "../domain/RedisConfiguration.js";
import {redisStore} from "../domain/RedisStore.js";

export async function createConnection(config: RedisConfiguration) {
  const {name, cache, ...redisOptions} = config;

  const retryStrategy = (times: number) => {
    logger().fatal({event: "REDIS_ERROR", message: `Redis is not responding - Retry count: ${times}`});
    return 2000;
  };

  let connection: RedisClientType | RedisClusterType<any, any>;

  const reconnectOnError = (err: any) => {
    logger().fatal({
      event: "REDIS_ERROR",
      message: `Redis - Reconnect on error: ${(err && err.message) || err}`,
      stack: err?.stack
    });
  };

  if ("nodes" in redisOptions) {
    const {nodes, ...clusterOptions} = redisOptions as any;

    connection = createCluster({
      rootNodes: nodes,
      ...clusterOptions
    } as any) as RedisClusterType<any, any>;
  } else {
    connection = createClient({
      ...redisOptions,
      socket: {
        reconnectStrategy: retryStrategy,
        ...(redisOptions as any).socket
      }
    } as any) as RedisClientType;

    (connection as any).on?.("error", reconnectOnError);
  }

  await connection.connect();

  logger().info("Connected to redis database...");

  if (configuration().get("cache") && cache) {
    configuration().set("cache.redisInstance", connection);
    configuration().set("cache.store", redisStore);
  }

  (connection as any).name = name;

  return connection;
}
