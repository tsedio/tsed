import type {PlatformRequestAccessors} from "@tsed/platform-http";
import type {FastifyRequest} from "fastify";

/** Exposes Fastify plugin-owned request capabilities to the portable request facade. */
export function createFastifyRequestAccessors(request: FastifyRequest): PlatformRequestAccessors {
  const native = request as FastifyRequest & {
    rawBody?: unknown;
    cookies?: Record<string, unknown>;
    session?: unknown;
    files?: unknown;
    accepts?: (mime: string | string[]) => string | string[] | false;
  };

  return {
    body: () => native.body,
    rawBody: () => native.rawBody,
    cookies: () => native.cookies as Record<string, unknown> | undefined,
    params: () => (native.params || {}) as Record<string, unknown>,
    session: () => native.session,
    files: () => native.files,
    accepts: (mime) => native.accepts?.(mime as any) || false
  };
}
