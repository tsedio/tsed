import {Allow as A} from "@tsed/schema";

/**
 * Add allowed values when the property or parameters is required.
 *
 * #### Example on parameter:
 *
 * ```typescript
 * @Post("/")
 * async method(@Required() @Allow("") @BodyParams("field") field: string) {}
 * ```
 * > Required will throw a BadRequest when the given value is `null` or `undefined` but not for an empty string.
 *
 * #### Example on model:
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
 * @ignore
 * @deprecated Use @Allow decorator from @tsed/schema instead of.
 */
export function Allow(...allowedRequiredValues: any[]): any {
  return A(...allowedRequiredValues);
}
