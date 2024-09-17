import {TokenProvider} from "@tsed/di";
import {Redis, Cluster, ClusterOptions, RedisOptions} from "ioredis";

export type ClusterConfiguration = {nodes: string[]} & ClusterOptions;

export interface BaseIORedisConfiguration {
  name?: TokenProvider;
  cache?: boolean;
}

export type IORedisConfiguration = BaseIORedisConfiguration &
  (RedisOptions | ClusterConfiguration) & {redisInstance?: Redis | Cluster; sentinelName?: string};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace TsED {
    interface Configuration {
      ioredis?: IORedisConfiguration[];
    }
  }
}
