import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Add optional annotation on Property or Parameter.
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export function Optional() {
  return JsonEntityFn((store, args) => {
    switch (store.decoratorType) {
      case DecoratorTypes.PARAM:
        store.parameter!.required(false);
        break;
      case DecoratorTypes.PROP:
        store.parentSchema.removeRequired(store.propertyName);
        break;
      default:
        throw new UnsupportedDecoratorType(Optional, args);
    }
  });
}
