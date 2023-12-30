import type Http from "http";
import type Http2 from "http2";
import type Https from "https";

export function closeServer(server: Http.Server | Https.Server | Http2.Http2Server) {
  return new Promise((resolve) => server.close(() => resolve(undefined)));
}
