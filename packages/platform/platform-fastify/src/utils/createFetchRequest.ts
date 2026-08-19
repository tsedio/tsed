import type {FastifyRequest} from "fastify";
import {Readable} from "node:stream";

/** Converts a Fastify request at the Node host boundary to a standard Fetch request. */
export function createFetchRequest(request: FastifyRequest): Request {
  const headers = new Headers();
  Object.entries(request.headers).forEach(([name, value]) => {
    if (value !== undefined) {
      ([] as string[]).concat(value as string | string[]).forEach((item) => headers.append(name, item));
    }
  });

  const method = request.method.toUpperCase();
  const init: RequestInit & {duplex?: "half"} = {method, headers};
  if (method !== "GET" && method !== "HEAD") {
    init.body = Readable.toWeb(request.raw) as ReadableStream;
    init.duplex = "half";
  }

  return new Request(new URL(request.url, `${request.protocol}://${request.hostname}`), init);
}
