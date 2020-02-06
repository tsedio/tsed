import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {RequestContext} from "../../mvc";

const onFinished = require("on-finished");
const uuidv4 = require("uuid/v4");

/**
 * Bind request and create a new context to store information during the request lifecycle. See @@RequestContext@@ for more details.
 *
 * @param injector
 */
export function contextMiddleware(injector: InjectorService) {
  return async (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
    const {level, maxStackSize, ignoreUrlPatterns = [], reqIdBuilder = () => uuidv4().replace(/-/gi, "")} = injector.settings.logger || {};

    const id = reqIdBuilder();

    request.ctx = new RequestContext({
      id,
      logger: injector.logger,
      url: request.originalUrl || request.url,
      ignoreUrlPatterns,
      level,
      maxStackSize
    });

    request.id = id;
    request.log = request.ctx.logger;

    onFinished(response, async () => {
      await injector.emit("$onResponse", request, response);
      await request.ctx.destroy();
    });

    await injector.emit("$onRequest", request, response);

    next();
  };
}
