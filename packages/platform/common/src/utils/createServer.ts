import type {ReturnHostInfoFromPort} from "@tsed/core";
import {getHostInfoFromPort} from "@tsed/core";
import type {InjectorService, TokenProvider} from "@tsed/di";
import {ProviderScope} from "@tsed/di";
import type Http from "http";
import type Http2 from "http2";
import type Https from "https";

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
