import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn} from "./jsonEntityFn.js";
import type {JsonParameterStore} from "../../domain/JsonParameterStore.js";

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
  return JsonEntityFn((store) => {
    switch (store.decoratorType) {
      case DecoratorTypes.PARAM:
        (store as JsonParameterStore).required = false;
        break;
      case DecoratorTypes.PROP:
        store.parentSchema.removeRequired(store.propertyName);
        break;
    }
  });
}
