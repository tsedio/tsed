import {applyDecorators, StoreMerge, StoreSet} from "@tsed/core";
import {mapReturnedResponse} from "../utils/mapReturnedResponse";
import {ReturnType} from "./returnType";
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
export function Status(code: number, options: TsED.ResponseOptions = {description: ""}) {
  const {use, collection} = options as any;

  return ReturnType({
    ...options,
    code,
    type: options.type || use,
    collectionType: options.collectionType || collection
  });
}
