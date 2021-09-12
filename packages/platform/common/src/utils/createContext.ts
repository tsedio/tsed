import {InjectorService} from "@tsed/di";
import {PlatformContext} from "../domain/PlatformContext";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";

const uuidv4 = require("uuid").v4;
const defaultReqIdBuilder = (req: any) => req.get("x-request-id") || uuidv4().replace(/-/gi, "");

/**
 * Create the TsED context to wrap request, response, injector, etc...
 * @param injector
 * @param request
 * @param response
 * @ignore
 */
export async function createContext(
  injector: InjectorService,
  request: PlatformRequest,
  response: PlatformResponse
): Promise<PlatformContext> {
  const {level, ignoreUrlPatterns, maxStackSize, reqIdBuilder = defaultReqIdBuilder} = injector.settings.logger;

  const req = request.getRequest();
  const id = reqIdBuilder(req);

  const ctx = new PlatformContext({
    id,
    logger: injector.logger,
    url: request.url,
    ignoreUrlPatterns,
    level,
    maxStackSize,
    injector,
    response,
    request
  });

  req.$ctx = ctx;

  response.setHeader("x-request-id", id);

  response.onEnd(async () => {
    await ctx.emit("$onResponse", ctx);
    await ctx.destroy();
    delete req.$ctx;
  });

  await ctx.emit("$onRequest", ctx);

  return ctx;
}
