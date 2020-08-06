import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";
import {PropertyFn} from "./property";

/**
 * Create an alias of the propertyKey that must be used by the json mapper and json schema.
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@Name@@ from @tsed/schema.
 * For v5 user, use @@Name@@ decorator from @tsed/common or @tsed/swagger then in v6 switch to @tsed/schema.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Name('aliasProp')
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
 * @deprecated Use @Name decorator instead. Will be removed in v6.
 */
export function PropertyName(name: string) {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.name = name;
  });
}

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
 */
export function Name(name: string): PropertyDecorator {
  return PropertyName(name) as any;
}
