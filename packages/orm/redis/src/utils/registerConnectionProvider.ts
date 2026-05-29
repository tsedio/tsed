import {constant, type FactoryTokenProvider, injectable, TokenProvider} from "@tsed/di";
import type {RedisClientType, RedisClusterType} from "redis";

import {RedisConfiguration} from "../domain/RedisConfiguration.js";
import {createConnection} from "./createConnection.js";

export interface CreateConnectionProviderProps {
  token: TokenProvider;
  /**
   * @deprecated use `token` instead of `provide`
   */
  provide?: TokenProvider;
  name?: string;
}

export const REDIS_CONNECTIONS = Symbol.for("redis:connections");
export type RedisConnection = (RedisClientType | RedisClusterType<any, any>) & {name: string};

export function registerConnectionProvider({
  token,
  name = "default"
}: CreateConnectionProviderProps): FactoryTokenProvider<RedisConnection> {
  return injectable(token, {
    connectionName: name
  })
    .type(REDIS_CONNECTIONS)
    .asyncFactory(() => {
      const items = constant<RedisConfiguration[]>("redis", []);
      const item = items.find((item) => item.name === name);

      return item ? createConnection({...item, name}) : ({name} as any);
    })
    .token() as FactoryTokenProvider<RedisConnection>;
}
