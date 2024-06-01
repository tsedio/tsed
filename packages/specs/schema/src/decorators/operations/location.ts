import {JsonHeader} from "../../interfaces/JsonOpenSpec.js";
import {Returns} from "./returns.js";

/**
 * Sets the response Location HTTP header to the specified path parameter.
 *
 * ```typescript
 *  @Location('/foo/bar', {description: 'Location to the next step'})
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
 * @param meta
 * @returns {Function}
 * @decorator
 * @operation
 */
export function Location(location: string, meta?: JsonHeader) {
  return Returns().Location(location, meta);
}
