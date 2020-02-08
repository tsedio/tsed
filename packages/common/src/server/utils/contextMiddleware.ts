import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {RequestContext} from "../../mvc";

const onFinished = require("on-finished");
const uuidv4 = require("uuid/v4");

const whenFinished = (request: any, response: any) => async () => {
  const {injector} = request.ctx;

  await injector.emit("$onResponse", request, response);
  await request.ctx.destroy();
  delete request.ctx;
  delete request.log;
};

/**
 * Bind request and create a new context to store information during the request lifecycle. See @@RequestContext@@ for more details.
 *
 * @param injector
 */
export function contextMiddleware(injector: InjectorService) {
  const {level, maxStackSize, ignoreUrlPatterns = [], reqIdBuilder = () => uuidv4().replace(/-/gi, "")} = injector.settings.logger || {};

  return async (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
    const id = reqIdBuilder();
    request.ctx = new RequestContext({
      id,
      logger: injector.logger,
      url: request.originalUrl || request.url,
      ignoreUrlPatterns,
      level,
      maxStackSize,
      injector
    });

    request.id = id;
    // deprecated
    request.log = request.ctx.logger;

    onFinished(response, whenFinished(request, response));

    await injector.emit("$onRequest", request, response);

    next();
  };
}
