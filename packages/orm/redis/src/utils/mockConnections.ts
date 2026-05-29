import {Provider, TokenProvider} from "@tsed/di";
import type {RedisClientType} from "redis";

import {REDIS_CONNECTIONS} from "./registerConnectionProvider.js";

export async function mockConnection(token: TokenProvider, name: string) {
  const RealTsEDRedis = await import("redis-mock");
  const connection: RedisClientType = (RealTsEDRedis as any).createClient();

  (connection as any).name = name;

  return {
    token,
    use: connection
  };
}

export function mockConnections() {
  return Promise.all(
    [...Provider.Registry.values()]
      .filter((provider) => provider.type === REDIS_CONNECTIONS)
      .map((provider) => mockConnection(provider.token, provider.connectionName))
  );
}
