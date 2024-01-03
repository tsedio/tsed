import {getHostInfoFromPort} from "@tsed/core";
import type Http from "http";
import type Http2 from "http2";
import type Https from "https";

export function listenServer(server: Http.Server | Https.Server | Http2.Http2Server, hostInfo: ReturnType<typeof getHostInfoFromPort>) {
  const {address, port} = hostInfo;

  const promise = new Promise((resolve, reject) => {
    server.on("listening", resolve);
    server.on("error", reject);
  });

  server.listen(port, address as any);

  return promise;
}
