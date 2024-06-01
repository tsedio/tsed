import {Schema} from "./schema.js";

/**
 * Constructs a json schema object type whose property keys are keys and whose property values are type.
 *
 * ## Example
 *
 * ```typescript
 * type keys = 'one' | 'two';
 *
 * class Part {
 *   prop: string;
 * }
 *
 * type Parts = Record<keys, Part>;
 *
 * class Test {
 *   @RecordOf(Part, 'one', 'two')
 *   parts: Parts;
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *     "type": "object",
 *     "properties": {
 *         "one": {
 *             "$ref": "#/components/schemas/Part"
 *         },
 *         "two": {
 *             "$ref": "#/components/schemas/Part"
 *         },
 *     },
 * }
 * ```
 *
 * @param model
 * @param keys
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @classDecorator
 * @input
 */
export function RecordOf(model: any, ...keys: string[]) {
  return Schema({
    properties: {
      ...keys.reduce((initial, key) => {
        return {
          ...initial,
          [key]: model
        };
      }, {})
    }
  });
}
