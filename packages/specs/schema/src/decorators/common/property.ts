import {isArrowFn, isClass} from "@tsed/core";

import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Declare a new property on a model.
 *
 * @param type
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export function Property(type?: any) {
  return JsonEntityFn((store) => {
    if (type) {
      if (isClass(type) || isArrowFn(type)) {
        store.type = type;
      }
      store.itemSchema.type(type);
    }
  });
}
