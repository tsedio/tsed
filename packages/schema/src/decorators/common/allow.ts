import {applyDecorators, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntityFn} from "./jsonEntityFn";

function applyStringRule(store: JsonEntityStore, values: any[]) {
  if (store.type === String) {
    if (!values.includes("")) {
      // Disallow empty string
      (!store.schema.has("minLength") || store.schema.get("minLength") === 0) && store.schema.minLength(1);
    } else {
      store.schema.delete("minLength");
    }
  }
}

function applyNullRule(store: JsonEntityStore, values: any[]) {
  if (values.includes(null)) {
    if (store.schema.isClass) {
      const properties = store.parent.schema.get("properties");

      if (properties && properties[store.propertyKey as any]) {
        const propSchema = properties[store.propertyKey as any];

        properties[store.propertyKey as any] = {
          oneOf: [
            {
              type: "null"
            },
            propSchema
          ]
        };
      }
    } else {
      store.schema.addTypes("null");
    }
  }
}

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
  return applyDecorators(
    JsonEntityFn((store, args) => {
      switch (store.decoratorType) {
        case DecoratorTypes.PARAM:
          store.parameter!.required(true);

          applyStringRule(store, values);
          applyNullRule(store, values);

          break;
        case DecoratorTypes.PROP:
          store.parentSchema.addRequired(store.propertyName);

          applyStringRule(store, values);
          applyNullRule(store, values);
          break;
        default:
          throw new UnsupportedDecoratorType(Allow, args);
      }
    })
  );
}
