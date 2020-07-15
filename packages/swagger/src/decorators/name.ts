import {Name as N} from "@tsed/schema";

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
 * @ignore
 * @deprecated Use @Name from @tsed/schema
 */
export function Name(name: string) {
  return N(name);
}
