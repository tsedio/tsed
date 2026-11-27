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
function staticType(target: any, type: DecoratorTypes, staticType: DecoratorTypes): DecoratorTypes {
  return target !== classOf(target) ? type : staticType;
}

export function decoratorTypeOf(args: any[]): DecoratorTypes {
  const target = args[0];
  const propertyKey = args[1];
  const descriptor = args[2];

  // no closure and no template string per call: a static member is declared on the class itself
  if (typeof descriptor === "number") {
    return propertyKey ? staticType(target, DecoratorTypes.PARAM, DecoratorTypes.PARAM_STC) : DecoratorTypes.PARAM_CTOR;
  }

  if (descriptor && descriptor.value) {
    return staticType(target, DecoratorTypes.METHOD, DecoratorTypes.METHOD_STC);
  }

  if ((propertyKey && descriptor === undefined) || descriptor) {
    return staticType(target, DecoratorTypes.PROP, DecoratorTypes.PROP_STC);
  }

  return DecoratorTypes.CLASS;
}
