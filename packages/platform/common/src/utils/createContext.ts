import {InjectorService} from "@tsed/di";
import {PlatformContext} from "../domain/PlatformContext";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";
import {IncomingEvent} from "../interfaces/IncomingEvent";
import {v4} from "uuid";

function defaultReqIdBuilder(req: any) {
  return req.get("x-request-id") || v4().split("-").join("");
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
    const ctx = new PlatformContext({
      ...opts,
      event,
      id: reqIdBuilder(event.request)
    });

    ctx.response.onEnd(async () => {
      await ctx.emit("$onResponse", ctx);
      await ctx.destroy();
    });

    await ctx.emit("$onRequest", ctx);

    return ctx;
  };
}
