import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyFn} from "./property";

/**
 * Call the function after property serialization.
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
export function PropertySerialize(fn: (value: any) => any) {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.onSerialize = fn;
  });
}
