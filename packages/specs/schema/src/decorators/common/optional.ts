import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";

import type {JsonParameterStore} from "../../domain/JsonParameterStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

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
