import {InjectorService} from "@tsed/di";
import {PlatformContext} from "../domain/PlatformContext";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";
import {IncomingEvent} from "../interfaces/IncomingEvent";
import {v4} from "uuid";

const defaultReqIdBuilder = (req: any) => req.get("x-request-id") || v4().split("-").join("");

/**
 * Create the TsED context to wrap request, response, injector, etc...
 * @param injector
 * @ignore
 */
export function createContext(injector: InjectorService) {
  const ResponseKlass = injector.getProvider(PlatformResponse)?.useClass;
  const RequestKlass = injector.getProvider(PlatformRequest)?.useClass;
  const {reqIdBuilder = defaultReqIdBuilder, ...loggerOptions} = injector.settings.logger;

  return async (event: IncomingEvent): Promise<PlatformContext> => {
    const ctx = new PlatformContext({
      event,
      id: reqIdBuilder(event.request),
      logger: injector.logger,
      ...loggerOptions,
      injector,
      ResponseKlass,
      RequestKlass
    });

    ctx.response.onEnd(async () => {
      await ctx.emit("$onResponse", ctx);
      await ctx.destroy();
    });

    await ctx.emit("$onRequest", ctx);

    return ctx;
  };
}
