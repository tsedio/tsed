import type {PlatformRequestAccessors} from "@tsed/platform-http";
import type {Context} from "koa";

/** Exposes Koa-owned request capabilities to the portable request facade. */
export function createKoaRequestAccessors(context: Context): PlatformRequestAccessors {
  const request = context.request as typeof context.request & {body?: unknown; rawBody?: unknown; files?: unknown};

  return {
    body: () => request.body,
    rawBody: () => request.rawBody,
    params: () => context.params || {},
    session: () => (context as Context & {session?: unknown}).session,
    files: () => request.files,
    accepts: (mime) => context.accepts(mime as any) || false
  };
}
