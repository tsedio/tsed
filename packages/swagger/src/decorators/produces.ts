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
 * @param produces
 * @decorator
 * @swagger
 * @methodDecorator
 * @classDecorator
 * @operation
 * @response
 */
export function Produces(...produces: string[]): Function {
  return Operation({produces});
}
