import {UseAfter} from "./useAfter";

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
  return UseAfter((request: any, response: any, next: any) => {
    response.location(location);

    next();
  });
}
