import {ReturnType} from "@tsed/common";
import {applyDecorators} from "@tsed/core";

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
 * @operation
 * @response
 */
export function Status(code: number, options: Partial<TsED.ResponseOptions> = {}) {
  return applyDecorators(
    ReturnType({
      ...options,
      code,
      collectionType: (options as any).collection || options.collectionType,
      type: (options as any).use || options.type
    })
  );
}
