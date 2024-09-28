import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";

import {JsonEntityFn} from "../common/jsonEntityFn.js";

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
 * @param summary
 * @decorator
 * @swagger
 * @schema
 * @operation
 */
export function Summary(summary: string) {
  return JsonEntityFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.METHOD) {
      throw new UnsupportedDecoratorType(Summary, args);
    }

    store.operation!.summary(summary);
  });
}
