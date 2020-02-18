"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
/**
 * Add title metadata on the decorated element.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Title("title")
 *    id: string;
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "id": {
 *        "type": "string",
 *        "title": "title"
 *     }
 *   }
 * }
 * ```
 *
 * @param {string} title
 * @returns {(...args: any[]) => any}
 * @decorator
 * @jsonschema
 * @property
 */
function Title(title) {
    return schema_1.Schema({ title });
}
exports.Title = Title;
//# sourceMappingURL=title.js.map