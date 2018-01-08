import {JsonSchema} from "../class/JsonSchema";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * An object instance is valid against `minProperties` if its number of properties is greater than, or equal to, the value of this keyword.
 *
 * !> The value of this keyword MUST be a non-negative integer.
 *
 * ?> Omitting this keyword has the same behavior as a value of 0.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Any()
 *    @MinProperties(10)
 *    property: any;
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "any",
 *       "minProperties": 10
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} minProperties
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 */
export function MinProperties(minProperties: number) {
    if (minProperties < 0) {
        throw new Error("The value of minProperties MUST be a non-negative integer.");
    }
    return  decoratorSchemaFactory((schema: JsonSchema) => {
        schema.minProperties = minProperties;
    });
}