import {InjectorService} from "@tsed/di";
import {v4} from "uuid";
import {PlatformContext} from "../domain/PlatformContext";
import {IncomingEvent} from "../interfaces/IncomingEvent";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";

function defaultReqIdBuilder(req: any) {
  return req.headers["x-request-id"] || v4().split("-").join("");
}

function mapIgnoreUrlPatterns(ignoreUrlPatterns: any[]) {
  return ignoreUrlPatterns.map((pattern: string | RegExp) => (typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern));
}

export function ignoreLog(ignoreUrlPatterns: any[] | undefined) {
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
export function createContext(injector: InjectorService) {
  const ResponseKlass = injector.getProvider(PlatformResponse)?.useClass;
  const RequestKlass = injector.getProvider(PlatformRequest)?.useClass;
  const {reqIdBuilder = defaultReqIdBuilder, ...loggerOptions} = injector.settings.logger;

  const opts = {
    logger: injector.logger,
    ...loggerOptions,
    ignoreLog: ignoreLog(loggerOptions.ignoreUrlPatterns),
    injector,
    ResponseKlass,
    RequestKlass
  };

  return async function invokeContext(event: IncomingEvent) {
    return new PlatformContext({
      ...opts,
      event,
      id: reqIdBuilder(event.request)
    });
  };
}
