import {DecoratorTypes, isClass, useDecorators} from "@tsed/core";

import type {JsonParameterStore} from "../../domain/JsonParameterStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";
import {Property} from "./property.js";

/**
 * Add allowed values when the property or parameters is required.
 *
 * #### Example on parameter:
 *
 * ```typescript
 * @Post("/")
 * async method(@Allow("") @BodyParams("field") field: string) {}
 * ```
 * > Required will throw a BadRequest when the given value is `null` or `undefined` but not for an empty string.
 *
 * #### Example on model:
 *
 * ```typescript
 * class Model {
 *   @Allow("")
 *   field: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export function Allow(...values: any[]) {
  const model = values.find((item) => isClass(item));
  return useDecorators(
    model && Property(model),
    JsonEntityFn((store, args) => {
      if (store.decoratorType === DecoratorTypes.PARAM) {
        (store as JsonParameterStore).required = true;
      }

      if (store.decoratorType === DecoratorTypes.PROP) {
        store.parentSchema.addRequired(store.propertyName);
      }

      store.schema.allow(...values);
    })
  );
}
