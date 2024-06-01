import {decoratorTypeOf} from "../utils/decorators/decoratorTypeOf.js";
import {classOf} from "../utils/objects/classOf.js";
import {nameOf} from "../utils/objects/nameOf.js";

export class UnsupportedDecoratorType extends Error {
  name: "UNSUPPORTED_DECORATOR_TYPE";

  constructor(decorator: any, args: any[]) {
    super(UnsupportedDecoratorType.buildMessage(decorator, args));
  }

  private static buildMessage(decorator: any, args: any[]): string {
    const [target, propertyKey, index] = args;

    const bindingType = decoratorTypeOf(args);
    const shortBinding = bindingType.split("/")[0];
    const param = shortBinding === "parameter" ? ".[" + index + "]" : "";
    const cstr = shortBinding === "parameter" ? ".constructor" : "";
    const method = propertyKey ? "." + propertyKey : cstr;

    const path = nameOf(classOf(target)) + method + param;

    return `${decorator.name} cannot be used as ${bindingType} decorator on ${path}`;
  }
}
