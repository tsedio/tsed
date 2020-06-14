import {UseAfter} from "./useAfter";
import {Next} from "../params/next";
import {Req} from "../params/request";
import {Res} from "../params/response";
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
  return UseAfter((request: Req, response: Res, next: Next) => {
    response.location(location);

    next();
  });
}
