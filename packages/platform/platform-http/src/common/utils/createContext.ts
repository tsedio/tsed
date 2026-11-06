import {configuration, injector} from "@tsed/di";
import {IncomingEvent} from "../interfaces/IncomingEvent.js";
import {PlatformContext} from "../domain/PlatformContext.js";
import {PlatformRequest} from "../services/PlatformRequest.js";
import {PlatformResponse} from "../services/PlatformResponse.js";
import {randomUUID} from "node:crypto";

/**
 * Return a 32 hex chars id, a uuid v4 without its dashes.
 * @ignore
 */
export function createRequestId() {
  const id = randomUUID();

  return id.slice(0, 8) + id.slice(9, 13) + id.slice(14, 18) + id.slice(19, 23) + id.slice(24);
}

/**
 * Reuse the incoming `x-request-id` header, or create a new id.
 * Express and Koa requests expose `get()`, a Fastify request only exposes `headers`.
 * @ignore
 */
export function defaultReqIdBuilder(req: any) {
  return (req.get ? req.get("x-request-id") : req.headers?.["x-request-id"]) || createRequestId();
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
export function createContext(): (event: IncomingEvent) => PlatformContext {
  const ResponseKlass = injector().providers.get(PlatformResponse)?.useClass;
  const RequestKlass = injector().providers.get(PlatformRequest)?.useClass;
  const {reqIdBuilder = defaultReqIdBuilder, ...loggerOptions} = configuration().logger;

  const opts = {
    ...loggerOptions,
    ResponseKlass,
    RequestKlass
  };

  const ignoreLog = buildIgnoreLog(loggerOptions.ignoreUrlPatterns);

  return function invokeContext(event: IncomingEvent) {
    const $ctx = new PlatformContext({
      ...opts,
      event,
      id: reqIdBuilder(event.request)
    });

    ignoreLog && $ctx.logger.alterIgnoreLog((ignore, data) => ignoreLog(ignore, data, $ctx.url));

    return $ctx;
  };
}
