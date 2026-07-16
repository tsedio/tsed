import type {RedisClientOptions, RedisClientType, RedisClusterType} from "redis";
import {TokenProvider} from "@tsed/di";

export type ClusterConfiguration = {
  nodes: any[];
} & Record<string, any>;

export interface BaseRedisConfiguration {
  name?: TokenProvider;
  cache?: boolean;
}

export type RedisConfiguration = BaseRedisConfiguration &
  (RedisClientOptions | ClusterConfiguration) & {redisInstance?: RedisClientType | RedisClusterType<any, any>; sentinelName?: string};

declare global {
  namespace TsED {
    interface Configuration {
      redis?: RedisConfiguration[];
    }
  }
}
