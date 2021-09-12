import {isClass} from "@tsed/core";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Declare a new property on a model.
 *
 * @param type
 * @decorator
 * @validation
 * @swagger
 * @schema
 */
export function Property(type?: any) {
  return JsonEntityFn((store) => {
    if (type) {
      if (isClass(type)) {
        store.type = type;
      }
      store.itemSchema.type(type);
    }
  });
}
