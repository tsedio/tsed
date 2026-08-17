import {Readable} from "node:stream";

export interface KoaResponseWriter {
  status: number;
  body: unknown;
  set(name: string, value: string): unknown;
}

/**
 * Writes a finalized Fetch response through Koa's native response boundary.
 */
export function writeFetchResponse(response: Response, context: KoaResponseWriter) {
  context.status = response.status;
  response.headers.forEach((value, name) => context.set(name, value));
  context.body = response.body ? Readable.fromWeb(response.body as any) : null;
}
