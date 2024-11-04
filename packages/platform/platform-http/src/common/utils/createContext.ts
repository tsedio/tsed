import {InjectorService} from "@tsed/di";
import {v4} from "uuid";

import {PlatformContext} from "../domain/PlatformContext.js";
import {IncomingEvent} from "../interfaces/IncomingEvent.js";
import {PlatformRequest} from "../services/PlatformRequest.js";
import {PlatformResponse} from "../services/PlatformResponse.js";

function defaultReqIdBuilder(req: any) {
  return req.get("x-request-id") || v4().split("-").join("");
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
 * @param injector
 * @ignore
 */
export function createContext(injector: InjectorService): (event: IncomingEvent) => PlatformContext {
  const ResponseKlass = injector.getProvider(PlatformResponse)?.useClass;
  const RequestKlass = injector.getProvider(PlatformRequest)?.useClass;
  const {reqIdBuilder = defaultReqIdBuilder, ...loggerOptions} = injector.settings.logger;

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
