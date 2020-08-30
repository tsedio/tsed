import {Injectable, InjectorService} from "@tsed/di";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {Next} from "../../mvc/decorators/params/next";
import {IMiddleware} from "../../mvc/interfaces/IMiddleware";
import {Context} from "../decorators/context";

function toHeaders(headers: {[key: string]: any}) {
  return Object.entries(headers).reduce((headers, [key, item]) => {
    return {
      ...headers,
      [key]: String(item.value),
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
    const {response} = ctx;
    const {
      statusCode,
      response: {headers = {}},
      contentType,
      redirect,
      location,
    } = ctx.endpoint;

    if (response.statusCode === 200) {
      response.status(statusCode);
    }

    response.setHeaders(toHeaders(headers));

    if (contentType) {
      response.contentType(contentType);
    }

    if (redirect) {
      response.redirect(redirect.status || 302, redirect.url);
    }

    if (location) {
      response.location(location);
    }

    next();
  }
}
