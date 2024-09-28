import {isString} from "@tsed/core";

import {JsonHeader, JsonHeaders} from "../../interfaces/JsonOpenSpec.js";
import {Returns} from "./returns.js";

/**
 * Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter.
 *
 * ```typescript
 * @Header('Content-Type', 'text/plain');
 * private myMethod() {}
 *
 * @Status(204)
 * @Header({
 *   "Content-Type": "text/plain",
 *   "Content-Length": 123,
 *   "ETag": {
 *     "value": "12345",
 *     "description": "header description"
 *   }
 * })
 * private myMethod() {}
 * ```
 *
 * This example will produce the swagger responses object:
 *
 * ```json
 * {
 *   "responses": {
 *     "204": {
 *       "description": "Description",
 *       "headers": {
 *          "Content-Type": {
 *             "type": "string"
 *          },
 *          "Content-Length": {
 *             "type": "number"
 *          },
 *          "ETag": {
 *             "type": "string",
 *             "description": "header description"
 *          }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @decorator
 * @operation
 * @response
 */
export function Header(headers: string | number | JsonHeaders, value?: string | number | JsonHeader): Function {
  if (value !== undefined) {
    headers = {[headers as string]: value};
  }
  if (value === undefined && isString(headers)) {
    headers = {[headers as string]: {type: "string"}};
  }

  return Returns().Headers(headers as JsonHeaders);
}
