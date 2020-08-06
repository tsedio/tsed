import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";
import {PropertyFn} from "./property";

/**
 * Call the function before property deserialization.
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@OnDeserialize@@ from @tsed/json-mapper.
 * For v5 user, use @@OnDeserialize@@ decorator from @tsed/common then in v6 switch to @tsed/schema.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @OnDeserialize(v => v + 1)
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
 * @deprecated Use OnDeserialize instead. Will be removed in v6.
 */
export function PropertyDeserialize(fn: (value: any) => any) {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.onDeserialize = fn;
  });
}

/**
 * Call the function before property deserialization.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @OnDeserialize(v => v + 1)
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
 * @alias PropertyDeserialize
 */
export function OnDeserialize(fn: (value: any) => any) {
  return PropertyDeserialize(fn);
}
