import type Http from "http";
import type Https from "https";
import type Http2 from "http2";
import {InjectorService} from "@tsed/di";
import {getHostInfoFromPort} from "@tsed/core";

export function listenServer(
  injector: InjectorService,
  server: Http.Server | Https.Server | Http2.Http2Server,
  hostInfo: ReturnType<typeof getHostInfoFromPort>
): Promise<ReturnType<typeof getHostInfoFromPort>> {
  const {protocol, address, port} = hostInfo;
  const url = `${protocol}://${address}:${port}`;
  injector.logger.debug(`Start server on ${url}`);

  const promise = new Promise((resolve, reject) => {
    server.on("listening", resolve);
    server.on("error", reject);
  }).then(() => {
    const port = (server.address() as any).port;
    const info = {...hostInfo, port};

    injector.logger.info(`Listen server on ${info.toString()}`);

    return info;
  });

  server.listen(port, address as any);

  return promise;
}
