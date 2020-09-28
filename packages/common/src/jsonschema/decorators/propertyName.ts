import {Name as N} from "@tsed/schema";

/**
 * Create an alias of the propertyKey that must be used by the converter.
 *
 * ::: tip
 * This decorator is used by the Converters to deserialize correctly you model.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Name(String)
 *    property: string[];
 * }
 * ```
 *
 * @param {string} name
 * @returns {Function}
 * @decorator
 * @jsonMapper
 * @schema
 * @property
 * @ignore
 * @deprecated Since v6. Use @Name decorator from @tsed/schema instead of.
 */
export function Name(name: string): PropertyDecorator {
  return N(name) as any;
}
