import {once} from "node:events";
import type {PlatformContext} from "@tsed/platform-http";

export interface FastifyResponseWriter {
  raw: {
    write(chunk: Uint8Array): boolean;
    end(callback?: () => void): unknown;
    once(event: "drain", listener: () => void): unknown;
  };
  code(statusCode: number): unknown;
  header(name: string, value: string): unknown;
}

/**
 * Writes the finalized Fetch response through Fastify's Node response boundary.
 */
export async function writeFetchResponse($ctx: PlatformContext) {
  const response = $ctx.response.finalize();
  const reply = $ctx.response.native as FastifyResponseWriter & {
    setCookie(name: string, value: string, options?: TsED.SetCookieOpts): unknown;
    clearCookie(name: string, options?: TsED.SetCookieOpts): unknown;
  };

  for (const {name, value, options} of $ctx.response.getCookies().values()) {
    value === null ? reply.clearCookie(name, options) : reply.setCookie(name, value, options);
  }

  reply.code(response.status);
  response.headers.forEach((value, name) => reply.header(name, value));

  if (!response.body) {
    await new Promise<void>((resolve) => reply.raw.end(resolve));
    return;
  }

  for await (const chunk of response.body) {
    if (!reply.raw.write(chunk)) {
      await once(reply.raw as any, "drain");
    }
  }

  await new Promise<void>((resolve) => reply.raw.end(resolve));
}
