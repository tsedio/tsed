import {getHostInfoFromPort} from "@tsed/core";
import {InjectorService, ProviderScope, TokenProvider} from "@tsed/di";
import Http from "http";
import Http2 from "http2";
import Https from "https";
import {listenServer} from "./listenServer";

export interface CreateServerOptions {
  token: TokenProvider;
  type: "http" | "https";
  port: string | false;
  server: () => Http.Server | Https.Server | Http2.Http2Server;
}

export type CreateServerReturn = () => Promise<Http.Server | Https.Server | Http2.Http2Server>;

export function createServer(
  injector: InjectorService,
  {token, type, port, server: get}: CreateServerOptions
): undefined | CreateServerReturn {
  const {settings} = injector;
  const server = port !== false ? get() : null;

  injector.addProvider(token, {
    scope: ProviderScope.SINGLETON,
    useValue: server
  });

  injector.invoke(token);

  if (server) {
    const hostInfo = getHostInfoFromPort(type, port);

    return async () => {
      const resolvedHostInfo = await listenServer(injector, server, hostInfo);
      settings.set(`${type}Port`, `${resolvedHostInfo.address}:${resolvedHostInfo.port}`);
      return server;
    };
  }
}
