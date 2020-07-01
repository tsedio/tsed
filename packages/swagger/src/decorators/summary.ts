import {Summary as S} from "@tsed/schema";

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
 * @deprecated Use @Summary from @tsed/schema. Will be removed in v7.
 */
export function Summary(summary: string): Function {
  return S(summary);
}
