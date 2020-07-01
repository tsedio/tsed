import {Produces as P} from "@tsed/schema";

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
 * @deprecated Use @Products from @tsed/schema
 */
export function Produces(...produces: string[]): Function {
  return P(...produces);
}
