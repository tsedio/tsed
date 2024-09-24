import {getHostInfoFromPort, ReturnHostInfoFromPort} from "@tsed/core";
import {InjectorService, ProviderScope, TokenProvider} from "@tsed/di";
import Http from "http";
import Http2 from "http2";
import Https from "https";

import {listenServer} from "./listenServer.js";

export interface CreateServerOptions {
  token: TokenProvider;
  type: "http" | "https";
  port: string | false;
  listen?: (hostInfo: ReturnHostInfoFromPort) => Promise<any>;
  server: () => Http.Server | Https.Server | Http2.Http2Server;
}

export type CreateServerReturn = () => Promise<Http.Server | Https.Server | Http2.Http2Server>;

export function createServer(
  injector: InjectorService,
  {token, type, port, server: get, listen}: CreateServerOptions
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
      const url = `${hostInfo.protocol}://${hostInfo.address}:${port}`;
      injector.logger.debug(`Start server on ${url}`);

      await (listen ? listen(hostInfo) : listenServer(server, hostInfo));

      const address = server.address();

      if (address && typeof address !== "string") {
        hostInfo.address = address.address;
        hostInfo.port = address.port;
      }

      injector.logger.info(`Listen server on ${hostInfo.toString()}`);
      settings.set(`${type}Port`, `${hostInfo.address}:${hostInfo.port}`);

      return server;
    };
  }
}
