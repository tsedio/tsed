import {InjectorService} from "@tsed/di";
import {RequestContext} from "../../platform";

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

  static async onClose(err: any, response: any) {
    const {req: request} = response;

    await request.ctx.emit("$onResponse", request, response);
    await request.ctx.destroy();

    delete request.ctx;
    delete request.log;
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

    onFinished(response, ContextMiddleware.onClose);

    await this.injector.emit("$onRequest", request, response);

    next();
  }
}
