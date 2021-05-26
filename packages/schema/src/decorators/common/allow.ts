import {DecoratorTypes, isClass, UnsupportedDecoratorType, useDecorators} from "@tsed/core";
import {JsonEntityFn} from "./jsonEntityFn";
import {Property} from "./property";

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
      store.schema.allow(...values);

      switch (store.decoratorType) {
        case DecoratorTypes.PARAM:
          store.parameter!.required(true);
          break;
        case DecoratorTypes.PROP:
          store.parentSchema.addRequired(store.propertyName);
          break;
        default:
          throw new UnsupportedDecoratorType(Allow, args);
      }
    })
  );
}
