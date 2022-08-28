import {GlobalProviders, TokenProvider} from "@tsed/di";
import Redis from "ioredis";
import RealIORedis from "ioredis-mock";
import {IOREDIS_CONNECTIONS} from "./registerConnectionProvider";

export function mockConnection(token: TokenProvider, name: string) {
  const connection: Redis = new (RealIORedis as any)();

  (connection as any).name = name;

  return {
    token,
    use: connection
  };
}

export function mockConnections() {
  return [...GlobalProviders.values()]
    .filter((provider) => provider.type === IOREDIS_CONNECTIONS)
    .map((provider) => mockConnection(provider.token, provider.connectionName));
}
