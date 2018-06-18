import {DecoratorParameters} from "../interfaces";
import {descriptorOf, getClass, nameOf} from "./ObjectUtils";

/**
 *
 * @param {any[]} args
 * @param longType
 * @returns {"parameter" | "property" | "property.static" | "method" | "method.static" | "class"}
 */
export function getDecoratorType(
  args: any[],
  longType = false
): "parameter" | "parameter.constructor" | "parameter.static" | "property" | "property.static" | "method" | "method.static" | "class" {
  const [target, propertyKey, descriptor] = args;

  const staticType = (type: string): any => {
    if (!longType) {
      return type;
    }

    return target !== getClass(target) ? type : ((type + ".static") as any);
  };

  if (typeof descriptor === "number") {
    return propertyKey ? staticType("parameter") : longType ? "parameter.constructor" : "parameter";
  }

  if ((propertyKey && descriptor === undefined) || (descriptor && (descriptor.get || descriptor.set))) {
    return staticType("property");
  }

  return descriptor && descriptor.value ? staticType("method") : "class";
}

/**
 *
 */
export class UnsupportedDecoratorType extends Error {
  name: "UNSUPPORTED_DECORATOR_TYPE";

  constructor(decorator: any, args: any[]) {
    super(UnsupportedDecoratorType.buildMessage(decorator, args));
  }

  private static buildMessage(decorator: any, args: any[]): string {
    const [target, propertyKey, index] = args;

    const bindingType = getDecoratorType(args, true);
    const shortBinding = bindingType.split("/")[0];
    const param = shortBinding === "parameter" ? ".[" + index + "]" : "";
    const cstr = shortBinding === "parameter" ? ".constructor" : "";
    const method = propertyKey ? "." + propertyKey : cstr;

    const path = nameOf(getClass(target)) + method + param;

    return `${decorator.name} cannot used as ${bindingType} at ${path}`;
  }
}

/**
 *
 * @param target
 * @param {string} propertyKey
 * @returns {DecoratorParameters}
 */
export function decoratorArgs(target: any, propertyKey: string): DecoratorParameters {
  return [target, propertyKey, descriptorOf(target, propertyKey)!];
}
