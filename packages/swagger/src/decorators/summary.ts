import {Operation} from "./operation";

/**
 * Add summary metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * class Model {
 *    @Summary("summary")
 *    id: string;
 * }
 * ```
 *
 * @param {string} summary
 * @decorator
 * @swagger
 * @schema
 * @operation
 */
export function Summary(summary: string): Function {
  return Operation({summary});
}
