import {setValue} from "@tsed/core";
import {configuration, logger} from "@tsed/di";
import ioredis, {type Cluster, type Redis, type RedisOptions} from "ioredis";

import {IORedisConfiguration} from "../domain/IORedisConfiguration.js";
import {ioRedisStore} from "../domain/IORedisStore.js";

export async function createConnection(config: IORedisConfiguration) {
  const {name, cache, ...redisOptions} = config;

  const retryStrategy = (times: number) => {
    logger().fatal({event: "REDIS_ERROR", message: `Redis is not responding - Retry count: ${times}`});
    return 2000;
  };

  let connection: Cluster | Redis;

  const reconnectOnError = (err: any) => {
    logger().fatal({
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

  logger().info("Connected to redis database...");

  if (configuration().get("cache") && cache) {
    configuration().set("cache.redisInstance", connection);
    configuration().set("cache.store", ioRedisStore);
  }

  (connection as any).name = name;

  return connection;
}
