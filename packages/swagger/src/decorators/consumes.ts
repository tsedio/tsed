import {Operation} from "./operation";

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
 * @param consumes
 */
export function Consumes(...consumes: string[]): Function {
  return Operation({consumes});
}
