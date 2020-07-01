import {Consumes as C} from "@tsed/schema";

/**
 * Add consumes metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * class Model {
 *    @Consumes("application/x-www-form-urlencoded")
 *    id: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @swagger
 * @classDecorator
 * @operation
 * @deprecated Use @Consumes from @tsed/schema
 * @ignore
 */
export function Consumes(...consumes: string[]): Function {
  return C(...consumes);
}
