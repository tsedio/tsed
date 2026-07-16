import {JsonEntityFn} from "../common/jsonEntityFn.js";
import {withErrorMsg} from "../../utils/withErrorMsg.js";

/**
 * Sets the minimum number of properties required on an object.
 *
 * The `@MinProperties()` decorator validates that an object has at least the specified
 * number of properties. This is useful for ensuring objects aren't empty, enforcing
 * minimum data requirements, or validating that dynamic objects have sufficient content.
 *
 * ### On Property
 *
 * ```typescript
 * class DataModel {
 *   @MinProperties(1)
 *   attributes: Record<string, any>;
 *   // Object must have at least 1 property
 * }
 * ```
 *
 * Generated schema:
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "attributes": {
 *       "type": "object",
 *       "minProperties": 1
 *     }
 *   }
 * }
 * ```
 *
 * ### On Class
 *
 * ```typescript
 * @MinProperties(2)
 * class RequiredDataModel {
 *   // Class instances must have at least 2 properties
 * }
 * ```
 *
 * Generated schema:
 * ```json
 * {
 *   "type": "object",
 *   "minProperties": 2
 * }
 * ```
 *
 * ### On Parameter
 *
 * ```typescript
 * @Controller("/api")
 * class ApiController {
 *   @Post("/filters")
 *   search(
 *     @BodyParams() @MinProperties(1) filters: any
 *   ) {
 *     // Filters object must have at least 1 property
 *   }
 * }
 * ```
 *
 * ### With MaxProperties - Range Validation
 *
 * ```typescript
 * class MetadataModel {
 *   @MinProperties(2)
 *   @MaxProperties(10)
 *   metadata: Record<string, string>;
 *   // Must have between 2 and 10 properties
 * }
 * ```
 *
 * ### Non-Empty Objects
 *
 * ```typescript
 * class SearchCriteria {
 *   @MinProperties(1)
 *   criteria: Record<string, any>;
 *   // Prevent empty search criteria objects
 * }
 * ```
 *
 * ### Dynamic Configuration
 *
 * ```typescript
 * class PluginConfig {
 *   @MinProperties(1)
 *   @AdditionalProperties({ type: "string" })
 *   options: Record<string, string>;
 *   // At least 1 configuration option required
 * }
 * ```
 *
 * ### Validation Examples
 *
 * ```typescript
 * @MinProperties(2)
 * data: object;
 *
 * // Valid:
 * { a: 1, b: 2 }             // 2 properties (≥ 2)
 * { a: 1, b: 2, c: 3 }       // 3 properties (≥ 2)
 *
 * // Invalid:
 * {}                         // 0 properties (< 2)
 * { a: 1 }                   // 1 property (< 2)
 * ```
 *
 * ### Use Cases
 *
 * - **Required Data**: Ensure objects have minimum content
 * - **Non-Empty Objects**: Prevent empty dynamic objects
 * - **Business Rules**: Enforce minimum configuration requirements
 * - **API Validation**: Require sufficient filter/search criteria
 * - **Data Quality**: Ensure objects contain meaningful data
 *
 * ### Filter Validation
 *
 * ```typescript
 * class QueryModel {
 *   @MinProperties(1)
 *   filters: Record<string, string>;
 *   // Must specify at least one filter
 * }
 * ```
 *
 * ### Combining with AdditionalProperties
 *
 * ```typescript
 * class FlexibleModel {
 *   @Property()
 *   id: string;
 *
 *   @MinProperties(3)
 *   @AdditionalProperties({ type: "string" })
 *   // 1 defined property + at least 2 additional properties = 3 minimum
 * }
 * ```
 *
 * ### Important Notes
 *
 * - The value must be a **non-negative integer** (0 or greater)
 * - Throws an error if a negative value is provided
 * - Omitting `@MinProperties()` is equivalent to `@MinProperties(0)` (no minimum)
 * - Counts all properties, including defined and additional ones
 * - Objects with exactly minProperties count are valid (inclusive)
 * - Can be combined with custom error messages using ajv-errors
 *
 * ### Default Behavior
 *
 * Without `@MinProperties()`, empty objects are valid:
 * ```typescript
 * data: Record<string, any>;
 * // Valid: {}, { a: 1 }, { a: 1, b: 2 }, etc.
 * ```
 *
 * With `@MinProperties(1)`, empty objects are rejected:
 * ```typescript
 * @MinProperties(1)
 * data: Record<string, any>;
 * // Invalid: {}
 * // Valid: { a: 1 }, { a: 1, b: 2 }, etc.
 * ```
 *
 * @param minProperties - Minimum number of properties required (must be non-negative)
 *
 * @decorator
 * @validation
 * @public
 */
export const MinProperties = withErrorMsg("minProperties", (minProperties: number) => {
  if (minProperties < 0) {
    throw new Error("The value of minProperties MUST be a non-negative integer.");
  }

  return JsonEntityFn((store) => {
    store.isCollection ? store.schema.minProperties(minProperties) : store.itemSchema.minProperties(minProperties);
  });
});
