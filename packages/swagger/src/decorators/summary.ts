import {getDecoratorType} from "@tsed/core";
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
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function Summary(summary: string): Function {
  return Operation({summary});
}
