import {JsonEntityFn} from "../common/jsonEntityFn.js";
import {withErrorMsg} from "../../utils/withErrorMsg.js";

/**
 * Sets the minimum number of items required in an array.
 *
 * The `@MinItems()` decorator validates that an array has at least the specified number
 * of elements. This is useful for ensuring required data is provided, enforcing business
 * rules, or guaranteeing minimum quantities.
 *
 * ### Basic Usage
 *
 * ```typescript
 * class OrderModel {
 *   @CollectionOf(String)
 *   @MinItems(1)
 *   items: string[];
 *   // Order must have at least 1 item
 * }
 * ```
 *
 * Generated schema:
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "items": {
 *       "type": "array",
 *       "minItems": 1,
 *       "items": {
 *         "type": "string"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * ### With MaxItems - Range Validation
 *
 * ```typescript
 * class VotingModel {
 *   @CollectionOf(String)
 *   @MinItems(3)
 *   @MaxItems(10)
 *   candidates: string[];
 *   // Must have between 3 and 10 candidates
 * }
 * ```
 *
 * ### Required Selections
 *
 * ```typescript
 * class SurveyResponse {
 *   @CollectionOf(String)
 *   @MinItems(1)
 *   selectedOptions: string[];
 *   // User must select at least one option
 * }
 * ```
 *
 * ### Business Rules
 *
 * ```typescript
 * class TeamCreation {
 *   @CollectionOf(String)
 *   @MinItems(2)
 *   memberIds: string[];
 *   // Team requires minimum 2 members
 * }
 * ```
 *
 * ### Validation Examples
 *
 * ```typescript
 * @MinItems(2)
 * items: string[];
 *
 * // Valid:
 * ["a", "b"]              // 2 items (≥ 2)
 * ["a", "b", "c"]         // 3 items (≥ 2)
 *
 * // Invalid:
 * []                      // 0 items (< 2)
 * ["a"]                   // 1 item (< 2)
 * ```
 *
 * ### Use Cases
 *
 * - **Required Data**: Ensure minimum data is provided
 * - **Business Logic**: Enforce minimum quantities (team size, votes)
 * - **Data Quality**: Prevent submission with insufficient information
 * - **User Input**: Require multiple selections or answers
 * - **Validation**: Ensure arrays are not empty when data is expected
 *
 * ### Non-Empty Arrays
 *
 * ```typescript
 * class CommentModel {
 *   @CollectionOf(String)
 *   @MinItems(1)
 *   tags: string[];
 *   // Prevent empty tag arrays
 * }
 * ```
 *
 * ### Combining with Uniqueness
 *
 * ```typescript
 * class CategoryModel {
 *   @CollectionOf(String)
 *   @MinItems(2)
 *   @UniqueItems()
 *   subcategories: string[];
 *   // Must have at least 2 unique subcategories
 * }
 * ```
 *
 * ### Important Notes
 *
 * - The value must be a **non-negative integer** (0 or greater)
 * - Throws an error if a negative value is provided
 * - Omitting `@MinItems()` is equivalent to `@MinItems(0)` (no minimum)
 * - Can be combined with custom error messages using ajv-errors
 * - Arrays with exactly minItems elements are valid (inclusive)
 *
 * ### Default Behavior
 *
 * Without `@MinItems()`, arrays can be empty:
 * ```typescript
 * @CollectionOf(String)
 * tags: string[];
 * // Valid: [], ["tag1"], ["tag1", "tag2"], etc.
 * ```
 *
 * With `@MinItems(1)`, empty arrays are rejected:
 * ```typescript
 * @CollectionOf(String)
 * @MinItems(1)
 * tags: string[];
 * // Invalid: []
 * // Valid: ["tag1"], ["tag1", "tag2"], etc.
 * ```
 *
 * @param minItems - Minimum number of items required (must be non-negative)
 *
 * @decorator
 * @validation
 * @public
 */
export const MinItems = withErrorMsg("minItems", (minItems: number) => {
  if (minItems < 0) {
    throw new Error("The value of minItems MUST be a non-negative integer.");
  }

  return JsonEntityFn((storedJson) => {
    storedJson.schema.minItems(minItems);
  });
});
