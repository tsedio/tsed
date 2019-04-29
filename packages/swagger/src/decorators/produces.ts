import {Operation} from "./operation";

/**
 * Add produces metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * class Model {
 *    @Produces("text/html")
 *    id: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @swagger
 * @param produces
 */
export function Produces(...produces: string[]): Function {
  return Operation({produces});
}
