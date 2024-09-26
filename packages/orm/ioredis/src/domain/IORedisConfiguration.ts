import type {TokenProvider} from "@tsed/di";
import type {Cluster, ClusterOptions, Redis, RedisOptions} from "ioredis";

export type ClusterConfiguration = {nodes: string[]} & ClusterOptions;

export interface BaseIORedisConfiguration {
  name?: TokenProvider;
  cache?: boolean;
}

export type IORedisConfiguration = BaseIORedisConfiguration &
  (RedisOptions | ClusterConfiguration) & {redisInstance?: Redis | Cluster; sentinelName?: string};

declare global {
  namespace TsED {
    interface Configuration {
      ioredis?: IORedisConfiguration[];
    }
  }
}
