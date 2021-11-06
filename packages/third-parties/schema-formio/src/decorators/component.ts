import {CustomKeys} from "@tsed/schema";

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

  return CustomKeys(component);
}
