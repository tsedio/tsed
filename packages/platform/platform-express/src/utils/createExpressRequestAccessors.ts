import type {PlatformRequestAccessors} from "@tsed/platform-http";
import type {Request} from "express";

/** Exposes Express middleware-owned request capabilities to the portable request facade. */
export function createExpressRequestAccessors(request: Request): PlatformRequestAccessors {
  const native = request as Request & {rawBody?: unknown; session?: unknown; files?: unknown};

  return {
    body: () => native.body,
    rawBody: () => native.rawBody,
    cookies: () => native.cookies,
    params: () => native.params || {},
    session: () => native.session,
    files: () => native.files,
    accepts: (mime) => native.accepts(mime as any) || false
  };
}
