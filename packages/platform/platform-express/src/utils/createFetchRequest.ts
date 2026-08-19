import type {Request as ExpressRequest} from "express";
import {Readable} from "node:stream";

function copyHeaders(headers: ExpressRequest["headers"]) {
  const result = new Headers();

  Object.entries(headers).forEach(([name, value]) => {
    if (value === undefined) {
      return;
    }

    ([] as string[]).concat(value as string | string[]).forEach((item) => result.append(name, item));
  });

  return result;
}

/**
 * Express-owned conversion from its native request to the standard Fetch
 * request consumed by the Ts.ED portable pipeline.
 */
export function createFetchRequest(request: ExpressRequest): Request {
  const headers = copyHeaders(request.headers);
  const protocol = request.protocol || ((request.socket as {encrypted?: boolean}).encrypted ? "https" : "http");
  const host = request.get("host") || headers.get("host") || "localhost";
  const method = request.method.toUpperCase();
  const init: RequestInit & {duplex?: "half"} = {
    method,
    headers
  };

  if (method !== "GET" && method !== "HEAD") {
    init.body = Readable.toWeb(request as any) as ReadableStream;
    init.duplex = "half";
  }

  return new Request(new URL(request.originalUrl || request.url, `${protocol}://${host}`), init);
}
