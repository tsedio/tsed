import {applyBefore} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {Context} from "../../mvc";

let AUTO_INCREMENT_ID = 1;

/**
 * Bind request and create a new context to store information during the request lifecycle
 * @param injector
 */
export function contextMiddleware(injector: InjectorService) {
  const getId = injector.settings.logger.reqIdBuilder || (() => String(AUTO_INCREMENT_ID++));

  return async (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
    request.ctx = new Context({id: getId()});
    request.id = request.ctx.id;

    await injector.emit("$onRequest", request, response);

    applyBefore(response, "end", async () => {
      await injector.emit("$onResponse", request, response);
      await request.ctx.destroy();
    });

    next();
  };
}
