import type {Context} from "koa";
import {Readable} from "node:stream";

/** Converts a Koa request at the Node host boundary to a standard Fetch request. */
export function createFetchRequest(context: Context): Request {
  const headers = new Headers();
  Object.entries(context.request.headers).forEach(([name, value]) => {
    if (value !== undefined) {
      ([] as string[]).concat(value as string | string[]).forEach((item) => headers.append(name, item));
    }
  });

  const method = context.method.toUpperCase();
  const init: RequestInit & {duplex?: "half"} = {method, headers};
  if (method !== "GET" && method !== "HEAD") {
    init.body = Readable.toWeb(context.req) as ReadableStream;
    init.duplex = "half";
  }

  return new Request(new URL(context.originalUrl || context.url, `${context.protocol}://${context.host}`), init);
}
