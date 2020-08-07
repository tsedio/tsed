import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";
import {PropertyFn} from "./property";

/**
 * Call the function after property serialization.
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@OnSerialize@@ from @tsed/json-mapper.
 * For v5 user, use @@OnSerialize@@ decorator from @tsed/common then in v6 switch to @tsed/schema.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @OnSerialize(v => v + 1)
 *    property: string;
 * }
 * ```
 *
 * @param {Function} fn
 * @returns {Function}
 * @decorator
 * @jsonMapper
 * @schema
 * @property
 * @deprecated Use OnSerialize instead. Will be removed in v6.
 */
export function PropertySerialize(fn: (value: any) => any) {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.onSerialize = fn;
  });
}

/**
 * Call the function after property serialization.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @OnSerialize(v => v + 1)
 *    property: string;
 * }
 * ```
 *
 * @param {Function} fn
 * @returns {Function}
 * @decorator
 * @jsonMapper
 * @schema
 * @property
 */
export function OnSerialize(fn: (value: any) => any) {
  return PropertySerialize(fn);
}
