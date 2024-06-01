import {DecoratorTypes} from "../../domain/DecoratorTypes.js";
import {classOf} from "../objects/classOf.js";

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
