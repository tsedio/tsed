import {Operation} from "./operation";

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
 */
export function Deprecated(): Function {
  return Operation({deprecated: true});
}
