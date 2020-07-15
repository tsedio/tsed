import {Deprecated as D} from "@tsed/schema";

/**
 * Add deprecated metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * class Model {
 *    @Deprecated()
 *    id: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @swagger
 * @schema
 * @operation
 * @ignore
 * @deprecated Use @Deprecated from @tsed/schema
 */
export function Deprecated(): Function {
  return D();
}
