import {PropertyName} from "@tsed/common";
import {getDecoratorType, Store} from "@tsed/core";
import {BaseParameter} from "./baseParameter";

/**
 * Add a name metadata on the decorated element.
 *
 * ## Examples
 * ### On parameters
 *
 * ```typescript
 * async myMethod(@Name("nameOf") @PathParams("id") id: string): Promise<Model>  {
 *
 * }
 * ```
 *
 * ### On property
 *
 * ```typescript
 * class Model {
 *   @Name("propAlias")
 *   prop1: string;
 * }
 * ```
 *
 * ### On Class
 *
 * ```typescript
 * @Name("AliasName")
 * @Controller("/")
 * class ModelCtrl {
 *
 * }
 * ```
 *
 * @param name
 * @returns {Function}
 * @decorator
 * @swagger
 * @class
 * @parameter
 */
export function Name(name: string) {
  return (...args: any[]) => {
    const type = getDecoratorType(args);
    switch (type) {
      case "property":
        return PropertyName(name)(...args);
      case "parameter":
        return BaseParameter({name})(...args);
      case "class":
        Store.from(...args).set("name", name);
        break;
      default:
        throw new Error("Name is only supported on property, parameters and class");
    }
  };
}
