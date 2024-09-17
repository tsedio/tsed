import {GlobalProviders, TokenProvider} from "@tsed/di";
import type {Redis} from "ioredis";

import {IOREDIS_CONNECTIONS} from "./registerConnectionProvider.js";

export async function mockConnection(token: TokenProvider, name: string) {
  const {default: RealIORedis} = await import("ioredis-mock");
  const connection: Redis = new (RealIORedis as any)();

  (connection as any).name = name;

  return {
    token,
    use: connection
  };
}

export function mockConnections() {
  return Promise.all(
    [...GlobalProviders.values()]
      .filter((provider) => provider.type === IOREDIS_CONNECTIONS)
      .map((provider) => mockConnection(provider.token, provider.connectionName))
  );
}
