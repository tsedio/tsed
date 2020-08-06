import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";
import {PropertyFn} from "./property";

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
 *    @CollectionOf(String)
 *    property: string[];
 * }
 * ```
 *
 * @param {string} name
 * @returns {Function}
 * @decorator
 * @converters
 * @jsonschema
 * @property
 */
export function PropertyName(name: string) {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.name = name;
  });
}
