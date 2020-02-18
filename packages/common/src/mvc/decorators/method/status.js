"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const returnType_1 = require("./returnType");
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
function Status(code, options = {}) {
    const { use, collection } = options;
    return returnType_1.ReturnType(Object.assign(Object.assign({}, options), { code, type: options.type || use, collectionType: options.collectionType || collection }));
}
exports.Status = Status;
//# sourceMappingURL=status.js.map