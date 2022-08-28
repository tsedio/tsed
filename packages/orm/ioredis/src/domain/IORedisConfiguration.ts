import {TokenProvider} from "@tsed/di";
import {ClusterOptions, RedisOptions} from "ioredis";

export type ClusterConfiguration = {nodes: string[]} & ClusterOptions;

export interface BaseIORedisConfiguration {
  name?: TokenProvider;
  cache?: boolean;
}

export type IORedisConfiguration = BaseIORedisConfiguration & (RedisOptions | ClusterConfiguration);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace TsED {
    interface Configuration {
      ioredis?: IORedisConfiguration[];
    }
  }
}
