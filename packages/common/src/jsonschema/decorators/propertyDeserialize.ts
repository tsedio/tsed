import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyFn} from "./property";

/**
 * Call the function before property is deserialization.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @PropertyDeserialize(v => v + 1)
 *    property: string;
 * }
 * ```
 *
 * @param {Function} fn
 * @returns {Function}
 * @decorator
 * @converters
 * @jsonschema
 * @property
 */
export function PropertyDeserialize(fn: (value: any) => any) {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.onDeserialize = fn;
  });
}
