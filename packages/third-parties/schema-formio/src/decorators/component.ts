import type {JsonEntityStore} from "@tsed/schema";
import {JsonEntityFn} from "@tsed/schema";

/**
 * Declare a formio Component schema on the decorated propertyKey.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Component(component: Record<string, any>): PropertyDecorator {
  component = Object.entries(component).reduce((component: Record<string, any>, [key, value]) => {
    if (key === "validate") {
      component["x-formio-validate"] = {
        ...(component["x-formio-validate"] || {}),
        ...value
      };
    }

    return {
      ...component,
      [`x-formio-${key}`]: value
    };
  }, {});

  return JsonEntityFn((store: JsonEntityStore) => {
    Object.entries(component).forEach(([key, value]) => {
      store.itemSchema.customKey(key, value);

      if (store.isCollection) {
        store.schema.customKey(key, value);
      }
    });
  });
}
