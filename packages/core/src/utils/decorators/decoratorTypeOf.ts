import {DecoratorTypes} from "../../domain/DecoratorTypes";
import {classOf} from "../objects/classOf";

/**
 * @deprecated Since 2020-11-28. Use decoratorTypeOf function.
 */
export function getDecoratorType(args: any[], longType = false): DecoratorTypes {
  const type = decoratorTypeOf(args);

  return longType ? type : ((type as string).split(".")[0] as any);
}

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
