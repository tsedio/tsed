import {Allow} from "@tsed/schema";

/**
 * Add required annotation for a function argument.
 *
 * The @Required decorator can be used on two cases.
 *
 * To decorate a parameters:
 *
 * ```typescript
 * @Post("/")
 * async method(@Required() @BodyParams("field") field: string) {}
 * ```
 *
 * To decorate a model:
 *
 * ```typescript
 * class Model {
 *   @Property()
 *   @Required()
 *   field: string;
 * }
 * ```
 *
 * > Required will throw a BadRequest when the given value is `null`, an empty string or `undefined`.
 *
 * ### Allow a values
 *
 * In some case, you didn't want trigger a BadRequest when the value is an empty string for example.
 * The decorator `@Allow()`, allow you to configure a value list for which there will be no exception.
 *
 * ```typescript
 * class Model {
 *   @Property()
 *   @Required()
 *   @Allow("")
 *   field: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @operation
 * @input
 * @schema
 * @validation
 * @deprecated Since v6. Use @Allow decorator from @tsed/schema instead of.
 */
export function Required(...allowedRequiredValues: any[]): any {
  return Allow(...allowedRequiredValues);
}
