import {isObject} from "@tsed/core";
import {Injectable, InjectorService} from "@tsed/di";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {Next} from "../../mvc/decorators/params/next";
import {IMiddleware} from "../../mvc/interfaces/IMiddleware";
import {Context} from "../decorators/context";

function toHeaders(headers: {[key: string]: any}) {
  return Object.entries(headers).reduce((headers, [key, item]) => {
    return {
      ...headers,
      [key]: String(item.example)
    };
  }, {});
}

/**
 * Add all headers, contentType, location, redirect and statusCode resolved for the current executed endpoint.
 *
 * @platform
 * @middleware
 */
@Middleware()
export class PlatformHeadersMiddleware implements IMiddleware {
  @Injectable()
  injector: InjectorService;

  use(@Context() ctx: Context, @Next() next: Next) {
    const {endpoint, response} = ctx;
    const {operation} = endpoint;

    if (response.statusCode === 200) {
      // apply status only if the isn't already modified
      response.status(operation.getStatus());
    }

    const headers = operation.getHeadersOf(response.statusCode);
    response.setHeaders(toHeaders(headers));

    if (endpoint.redirect) {
      response.redirect(endpoint.redirect.status || 302, endpoint.redirect.url);
    }

    if (endpoint.location) {
      response.location(endpoint.location);
    }

    next();
  }
}
