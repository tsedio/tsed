import {Next} from "../params/next";
import {Req} from "../params/request";
import {Res} from "../params/response";
import {UseAfter} from "./useAfter";

export const locationMiddleware = (location: string) =>
  (request: Req, response: Res, next: Next) => {
    response.location(location);

    next();
  };

/**
 * Sets the response Location HTTP header to the specified path parameter.
 *
 * ```typescript
 *  @Location('/foo/bar')
 *  @Location('http://example.com')
 *  @Location('back')
 *  private myMethod() {
 *
 *  }
 * ```
 *
 * A path value of “back” has a special meaning, it refers to the URL specified in the `Referer` header of the request. If the `Referer` header was not specified, it refers to “/”.
 *
 * @param location
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Location(location: string): Function {
  return UseAfter(locationMiddleware(location));
}
