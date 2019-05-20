import {applyDecorators, StoreSet, StoreMerge} from "@tsed/core";
import {IResponseOptions} from "../../interfaces/IResponseOptions";
import {mapReturnedResponse} from "../../utils/mapReturnedResponse";
import {UseAfter} from "./useAfter";

/**
 * Set the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
 *
 * ```typescript
 * @Status(204)
 * async myMethod() {}
 * ```
 *
 * With swagger description:
 *
 * ```typescript
 * @Status(204, {
 *   type: Model
 *   description: "Description"
 * })
 * @Header('Content-Type', 'application-json')
 * async myMethod() {
 * }
 * ```
 *
 * This example will produce the swagger responses object:
 *
 * ```json
 * {
 *   "responses": {
 *     "404": {
 *       "description": "Description",
 *       "headers": {
 *          "Content-Type": {
 *             "type": "string"
 *          }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param code
 * @param options
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Status(code: number, options: IResponseOptions = {}) {
  const response = mapReturnedResponse(options);

  return applyDecorators(
    StoreSet("statusCode", code),
    StoreMerge("response", response),
    StoreMerge("responses", {[code]: response}),
    UseAfter((request: any, response: any, next: any) => {
      if (response.statusCode === 200) {
        response.status(code);
      }
      next();
    })
  );
}
