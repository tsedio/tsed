import {configuration} from "@tsed/di";
import {PlatformContext} from "../domain/PlatformContext.js";
import {PlatformNativeContext} from "../fetch/PlatformHostBridge.js";
import type {PlatformRequestAccessors} from "../services/PlatformRequest.js";
import {v4} from "uuid";

function defaultReqIdBuilder(req: any) {
  return req.get?.("x-request-id") || req.headers?.get?.("x-request-id") || v4().split("-").join("");
}

function mapIgnoreUrlPatterns(ignoreUrlPatterns: any[]) {
  return ignoreUrlPatterns.map((pattern: string | RegExp) => (typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern));
}

export function buildIgnoreLog(ignoreUrlPatterns: any[] | undefined) {
  if (ignoreUrlPatterns) {
    ignoreUrlPatterns = mapIgnoreUrlPatterns(ignoreUrlPatterns);
    return (ignore: boolean, data: any, url: string) => ignoreUrlPatterns?.find((reg) => !!url.match(reg));
  }
}

/**
 * Create the TsED context to wrap request, response, injector, etc...
 * @ignore
 */
export function createContext(): (event: PlatformNativeContext) => PlatformContext {
  const {reqIdBuilder = defaultReqIdBuilder, ...loggerOptions} = configuration().logger;

  const opts = loggerOptions;

  const ignoreLog = buildIgnoreLog(loggerOptions.ignoreUrlPatterns);

  return function invokeContext(event: PlatformNativeContext) {
    const request = createNativeFetchRequest(event.request);
    const $ctx = new PlatformContext({
      ...opts,
      event,
      fetch: request,
      accessors: createRequestAccessors(event.request),
      id: reqIdBuilder(event.request)
    });

    ignoreLog && $ctx.logger.alterIgnoreLog((ignore, data) => ignoreLog(ignore, data, $ctx.url));

    return $ctx;
  };
}

/**
 * Creates a request scope for direct Fetch execution without requiring native
 * request or response objects.
 */
export function createFetchContext(
  request: Request,
  runtime?: import("../fetch/PlatformRuntimeContext.js").PlatformRuntimeContext,
  {event, accessors}: {event?: PlatformNativeContext; accessors?: PlatformRequestAccessors} = {}
): PlatformContext {
  const {reqIdBuilder = defaultReqIdBuilder, ...loggerOptions} = configuration().logger;
  const $ctx = new PlatformContext({
    ...loggerOptions,
    event,
    fetch: request,
    runtime,
    accessors: accessors || (event ? createRequestAccessors(event.request) : undefined),
    id: reqIdBuilder(request)
  });

  const ignoreLog = buildIgnoreLog(loggerOptions.ignoreUrlPatterns);
  ignoreLog && $ctx.logger.alterIgnoreLog((ignore, data) => ignoreLog(ignore, data, request.url));

  return $ctx;
}

function createNativeFetchRequest(native: any): Request {
  const protocol = native.protocol || (native.secure ? "https" : "http");
  const host = native.get?.("host") || native.headers?.host || "localhost";
  const url = new URL(native.originalUrl || native.url || "/", `${protocol}://${host}`);
  const headers = Object.entries(native.headers || {}).reduce((result, [name, value]) => {
    if (value !== undefined) {
      result.set(name, Array.isArray(value) ? value.join(", ") : String(value));
    }
    return result;
  }, new Headers());

  return new Request(url, {method: native.method || "GET", headers});
}

function createRequestAccessors(native: any): PlatformRequestAccessors {
  return {
    body: () => native.body,
    rawBody: () => native.rawBody ?? native.body,
    cookies: () => native.cookies,
    params: () => native.params || {},
    session: () => native.session,
    files: () => native.files,
    accepts: (mime) => native.accepts?.(mime) || false
  };
}
