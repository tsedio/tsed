import {CustomKeys} from "@tsed/schema";

/**
 * Declare a formio Component schema on the decorated propertyKey.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Component(component: Record<string, any>): PropertyDecorator {
  component = Object.entries(component).reduce((component, [key, value]) => {
    return {
      ...component,
      [`x-formio-${key}`]: value
    };
  }, {});

  return CustomKeys(component);
}
