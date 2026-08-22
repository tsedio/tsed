import {once} from "node:events";
import type {PlatformContext} from "@tsed/platform-http";

export interface ExpressResponseWriter {
  status(status: number): unknown;
  set(name: string, value: string): unknown;
  write(chunk: Uint8Array): boolean;
  end(): unknown;
  once(event: "drain" | "finish", listener: () => void): unknown;
}

function endResponse(native: ExpressResponseWriter): Promise<void> {
  return new Promise<void>((resolve) => {
    native.once("finish", resolve);
    native.end();
  });
}

/**
 * Writes a portable Fetch response to an Express response.
 */
export async function writeFetchResponse($ctx: PlatformContext, response: Response): Promise<void> {
  const native = $ctx.response.native as ExpressResponseWriter & {
    cookie(name: string, value: string, options?: TsED.SetCookieOpts): unknown;
    clearCookie(name: string, options?: TsED.SetCookieOpts): unknown;
  };

  for (const {name, value, options} of $ctx.response.getCookies().values()) {
    value === null ? native.clearCookie(name, options) : native.cookie(name, value, options);
  }

  native.status(response.status);
  response.headers.forEach((value, name) => native.set(name, value));

  if (!response.body) {
    await endResponse(native);
    return;
  }

  for await (const chunk of response.body) {
    if (native.write(chunk) === false) {
      await once(native as any, "drain");
    }
  }

  await endResponse(native);
}
