import {Readable} from "node:stream";
import type {PlatformContext} from "@tsed/platform-http";

export interface KoaResponseWriter {
  status: number;
  body: unknown;
  set(name: string, value: string): unknown;
}

/**
 * Writes a finalized Fetch response through Koa's native response boundary.
 */
export function writeFetchResponse($ctx: PlatformContext, response: Response) {
  const native = $ctx.response.native as {
    ctx: KoaResponseWriter & {cookies: {set(name: string, value?: string, options?: TsED.SetCookieOpts): unknown}};
  };
  const context = native.ctx;

  for (const {name, value, options} of $ctx.response.getCookies().values()) {
    context.cookies.set(name, value === null ? undefined : value, options);
  }

  context.status = response.status;
  response.headers.forEach((value, name) => context.set(name, value));
  context.body = response.body ? Readable.fromWeb(response.body as any) : null;
}
