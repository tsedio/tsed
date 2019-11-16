import {applyBefore} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {RequestContext} from "../../mvc";

const uuidv4 = require("uuid/v4");

/**
 * Bind request and create a new context to store information during the request lifecycle. See @@RequestContext@@ for more details.
 *
 * @param injector
 */
export function contextMiddleware(injector: InjectorService) {
  const {
    ignoreUrlPatterns = [],
    reqIdBuilder = (() => uuidv4().replace(/-/gi, ""))
  } = injector.settings.logger || {};

  return async (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
    const id = reqIdBuilder();

    request.ctx = new RequestContext({
      id,
      logger: injector.logger,
      url: request.originalUrl || request.url,
      ignoreUrlPatterns
    });

    request.id = id;
    request.log = request.ctx.logger;

    applyBefore(response, "end", async () => {
      await injector.emit("$onResponse", request, response);
      await request.ctx.destroy();
    });

    await injector.emit("$onRequest", request, response);

    next();
  };
}
