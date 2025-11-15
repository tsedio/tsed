import {DecoratorTypes} from "../types/DecoratorTypes.js";
import {classOf} from "./classOf.js";

/**
 * Determines the decorator type from decorator parameters.
 *
 * Analyzes the target, propertyKey, and descriptor to classify the decorator as
 * class, method, property, parameter, or their static variants.
 *
 * @public
 * @since v7.0.0
 * @see DecoratorTypes
 */
export function decoratorTypeOf(args: any[]): DecoratorTypes {
  const [target, propertyKey, descriptor] = args;

  const staticType = (type: string): any => {
    return target !== classOf(target) ? type : `${type}.static`;
  };

  if (typeof descriptor === "number") {
    return propertyKey ? staticType("parameter") : "parameter.constructor";
  }

  if (descriptor && descriptor.value) {
    return staticType("method");
  }

  if ((propertyKey && descriptor === undefined) || descriptor) {
    return staticType("property");
  }

  return DecoratorTypes.CLASS;
}
