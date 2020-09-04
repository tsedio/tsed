import {InjectorService} from "@tsed/di";
import {Req} from "../../mvc/decorators/params/request";
import {PlatformContext} from "../domain/PlatformContext";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";

const uuidv4 = require("uuid/v4");
const defaultReqIdBuilder = () => uuidv4().replace(/-/gi, "");

/**
 * Create a context with all required object to call next handlers.
 *
 * @platform
 * @middleware
 */
export class PlatformContextMiddleware {
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

  static async onClose(err: any, response: TsED.Response) {
    const {req: request} = response;

    await request.$ctx.emit("$onResponse", request, response);
    await request.$ctx.destroy();

    delete request.ctx;
    // @ts-ignore
    delete request.log;
  }

  async use(req: Req, res: any, next: any) {
    const {level, ignoreUrlPatterns, maxStackSize} = this;

    const id = this.reqIdBuilder();
    const request = PlatformRequest.create(this.injector, req);
    const response = PlatformResponse.create(this.injector, res);

    req.$ctx = new PlatformContext({
      id,
      logger: this.injector.logger,
      url: request.url,
      ignoreUrlPatterns,
      level,
      maxStackSize,
      injector: this.injector,
      response,
      request
    });

    response.onEnd(PlatformContextMiddleware.onClose);

    await this.injector.emit("$onRequest", req, res);

    next();
  }
}
