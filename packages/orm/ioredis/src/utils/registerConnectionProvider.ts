import {type FactoryTokenProvider, TokenProvider, constant, injectable} from "@tsed/di";
import {IORedisConfiguration} from "../domain/IORedisConfiguration.js";
import type {Redis} from "ioredis";
import {createConnection} from "./createConnection.js";

export interface CreateConnectionProviderProps {
  token: TokenProvider;
  /**
   * @deprecated use `token` instead of `provide`
   */
  provide?: TokenProvider;
  name?: string;
}

export const IOREDIS_CONNECTIONS = Symbol.for("ioredis:connections");
export type IORedis = Redis & {name: string};

export function registerConnectionProvider({token, provide, name = "default"}: CreateConnectionProviderProps): FactoryTokenProvider<Redis> {
  return injectable(provide || token, {
    connectionName: name
  })
    .type(IOREDIS_CONNECTIONS)
    .asyncFactory(() => {
      const items = constant<IORedisConfiguration[]>("ioredis", []);
      const item = items.find((item) => item.name === name);

      return item ? createConnection({...item, name}) : ({name} as any);
    })
    .token() as FactoryTokenProvider<Redis>;
}
