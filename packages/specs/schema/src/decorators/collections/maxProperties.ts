import {JsonEntityFn} from "../common/jsonEntityFn.js";
import {withErrorMsg} from "../../utils/withErrorMsg.js";

/**
 * Sets the maximum number of properties allowed on an object.
 *
 * The `@MaxProperties()` decorator validates that an object has at most the specified
 * number of properties. This is useful for limiting dynamic object sizes, preventing
 * excessive data structures, or enforcing schema constraints on flexible objects.
 *
 * ### On Property
 *
 * ```typescript
 * class ConfigModel {
 *   @MaxProperties(5)
 *   metadata: Record<string, any>;
 *   // Object can have at most 5 properties
 * }
 * ```
 *
 * Generated schema:
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "metadata": {
 *       "type": "object",
 *       "maxProperties": 5
 *     }
 *   }
 * }
 * ```
 *
 * ### On Class
 *
 * ```typescript
 * @MaxProperties(10)
 * class DynamicModel {
 *   // Class instances can have at most 10 properties total
 * }
 * ```
 *
 * Generated schema:
 * ```json
 * {
 *   "type": "object",
 *   "maxProperties": 10
 * }
 * ```
 *
 * ### On Parameter
 *
 * ```typescript
 * @Controller("/api")
 * class ApiController {
 *   @Post("/config")
 *   updateConfig(
 *     @BodyParams() @MaxProperties(10) config: any
 *   ) {
 *     // Config object limited to 10 properties
 *   }
 * }
 * ```
 *
 * ### With MinProperties - Range Validation
 *
 * ```typescript
 * class FilterModel {
 *   @MinProperties(1)
 *   @MaxProperties(5)
 *   filters: Record<string, string>;
 *   // Must have 1-5 filter properties
 * }
 * ```
 *
 * ### Dynamic Objects
 *
 * ```typescript
 * class UserPreferences {
 *   @MaxProperties(20)
 *   @AdditionalProperties({ type: "string" })
 *   settings: Record<string, string>;
 *   // Up to 20 custom settings, all string values
 * }
 * ```
 *
 * ### Validation Examples
 *
 * ```typescript
 * @MaxProperties(2)
 * data: object;
 *
 * // Valid:
 * {}                         // 0 properties (≤ 2)
 * { a: 1 }                   // 1 property (≤ 2)
 * { a: 1, b: 2 }             // 2 properties (≤ 2)
 *
 * // Invalid:
 * { a: 1, b: 2, c: 3 }       // 3 properties (> 2)
 * ```
 *
 * ### Use Cases
 *
 * - **API Rate Limiting**: Restrict filter/query parameter counts
 * - **Performance**: Prevent overly complex objects
 * - **Schema Constraints**: Limit dynamic data structures
 * - **Configuration**: Cap number of custom settings
 * - **Security**: Prevent payload bloat attacks
 *
 * ### Flexible Schemas
 *
 * ```typescript
 * class ExtensibleModel {
 *   @Property()
 *   id: string;
 *
 *   @Property()
 *   name: string;
 *
 *   @MaxProperties(5)
 *   @AdditionalProperties(true)
 *   // 2 defined properties + up to 3 additional properties
 * }
 * ```
 *
 * ### Important Notes
 *
 * - The value must be a **non-negative integer** (0 or greater)
 * - Throws an error if a negative value is provided
 * - Empty objects (`{}`) always pass maxProperties validation
 * - Counts all properties, including inherited and additional ones
 * - Can be combined with custom error messages using ajv-errors
 *
 * @param maxProperties - Maximum number of properties allowed (must be non-negative)
 *
 * @decorator
 * @validation
 * @public
 */
export const MaxProperties = withErrorMsg("maxProperties", (maxProperties: number) => {
  if (maxProperties < 0) {
    throw new Error("The value of maxProperties MUST be a non-negative integer.");
  }

  return JsonEntityFn((store) => {
    store.isCollection ? store.schema.maxProperties(maxProperties) : store.itemSchema.maxProperties(maxProperties);
  });
});
