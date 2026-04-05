import {classOf} from "../utils/classOf.js";
import {decoratorTypeOf} from "../utils/decoratorTypeOf.js";
import {nameOf} from "../utils/nameOf.js";

/**
 * Error thrown when a decorator is used in an unsupported location or context.
 *
 * Provides a descriptive message indicating where the decorator was applied and why it's invalid.
 *
 * @public
 * @since v7.0.0
 */
export class UnsupportedDecoratorType extends Error {
  override name = "UNSUPPORTED_DECORATOR_TYPE" as const;

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
