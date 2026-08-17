import type {PlatformRuntimeContext} from "./PlatformRuntimeContext.js";

/**
 * Portable HTTP entry point produced by a Ts.ED v9 application.
 *
 * Host bridges convert their incoming request to a standard {@link Request} and
 * delegate controller execution to this handler.
 */
export type PlatformFetchHandler = (request: Request, runtime?: PlatformRuntimeContext) => Promise<Response>;
