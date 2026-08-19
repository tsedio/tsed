import {configuration, injector} from "@tsed/di";
import {PlatformContext} from "../domain/PlatformContext.js";
import {PlatformNativeContext} from "../fetch/PlatformHostBridge.js";
import {PlatformRequest} from "../services/PlatformRequest.js";
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
  const RequestKlass = injector().providers.get(PlatformRequest)?.useClass;
  const {reqIdBuilder = defaultReqIdBuilder, ...loggerOptions} = configuration().logger;

  const opts = {
    ...loggerOptions,
    RequestKlass
  };

  const ignoreLog = buildIgnoreLog(loggerOptions.ignoreUrlPatterns);

  return function invokeContext(event: PlatformNativeContext) {
    const $ctx = new PlatformContext({
      ...opts,
      event,
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
  event?: PlatformNativeContext
): PlatformContext {
  const RequestKlass = injector().providers.get(PlatformRequest)?.useClass;
  const {reqIdBuilder = defaultReqIdBuilder, ...loggerOptions} = configuration().logger;
  const $ctx = new PlatformContext({
    ...loggerOptions,
    RequestKlass,
    event,
    fetch: request,
    runtime,
    id: reqIdBuilder(request)
  });

  const ignoreLog = buildIgnoreLog(loggerOptions.ignoreUrlPatterns);
  ignoreLog && $ctx.logger.alterIgnoreLog((ignore, data) => ignoreLog(ignore, data, request.url));

  return $ctx;
}
