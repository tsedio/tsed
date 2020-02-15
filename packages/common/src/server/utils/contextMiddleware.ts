import {InjectorService} from "@tsed/di";
import {RequestContext} from "../../mvc";

const onFinished = require("on-finished");
const uuidv4 = require("uuid/v4");

const defaultReqIdBuilder = () => uuidv4().replace(/-/gi, "");

export class ContextMiddleware {
  level: "debug" | "info" | "warn" | "error" | "off" | undefined;
  maxStackSize: number;
  ignoreUrlPatterns: string[];
  reqIdBuilder: any;

  constructor(private injector: InjectorService) {
    const {level, maxStackSize, ignoreUrlPatterns = [], reqIdBuilder = defaultReqIdBuilder} = injector.settings.logger || {};

    this.level = level;
    this.maxStackSize = maxStackSize!;
    this.ignoreUrlPatterns = ignoreUrlPatterns;
    this.reqIdBuilder = reqIdBuilder;
  }

  async use(request: any, response: any, next: any) {
    const {level, ignoreUrlPatterns, maxStackSize} = this;

    const id = this.reqIdBuilder();

    request.ctx = new RequestContext({
      id,
      logger: this.injector.logger,
      url: request.originalUrl || request.url,
      ignoreUrlPatterns,
      level,
      maxStackSize,
      injector: this.injector
    });

    // deprecated
    request.log = request.ctx.logger;

    onFinished(response, ContextMiddleware.onClose);

    await this.injector.emit("$onRequest", request, response);

    next();
  }

  static async onClose(err: any, response: any) {
    const {req: request} = response;
    try {
      await request.ctx.emit("$onResponse", request, response);
      await request.ctx.destroy();
    } catch (er) {}

    delete request.ctx;
    delete request.log;
  }
}

/**
 * Bind request and create a new context to store information during the request lifecycle. See @@RequestContext@@ for more details.
 *
 * @param injector
 */
export function contextMiddleware(injector: InjectorService) {
  const middleware = new ContextMiddleware(injector);

  return middleware.use.bind(middleware);
}
