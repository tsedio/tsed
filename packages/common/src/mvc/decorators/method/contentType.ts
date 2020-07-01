import {applyDecorators} from "@tsed/core";
import {Produces} from "@tsed/schema";
import {Next} from "../params/next";
import {Req} from "../params/request";
import {Res} from "../params/response";
import {UseAfter} from "./useAfter";

/**
 * Sets the Content-Type HTTP header to the MIME type as determined by mime.lookup() for the specified type.
 * If type contains the “/” character, then it sets the `Content-Type` to type.
 *
 * ```typescript
 *  @ContentType('.html');              // => 'text/html'
 *  @ContentType('html');               // => 'text/html'
 *  @ContentType('json');               // => 'application/json'
 *  @ContentType('application/json');   // => 'application/json'
 *  @ContentType('png');                // => image/png
 *  private myMethod() {}
 * ```
 *
 * @param type
 * @decorator
 * @operation
 * @response
 * @headers
 */
export function ContentType(type: string) {
  return applyDecorators(
    Produces(type),
    UseAfter((request: Req, response: Res, next: Next) => {
      response.contentType(type);
      next();
    })
  );
}
