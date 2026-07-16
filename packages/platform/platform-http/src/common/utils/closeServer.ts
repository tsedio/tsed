import type Http from "node:http";
import type Http2 from "http2";
import type Https from "node:https";

export function closeServer(server: Http.Server | Https.Server | Http2.Http2Server) {
  if (server.close) {
    return new Promise((resolve) => server.close(() => resolve(undefined)));
  }
}
