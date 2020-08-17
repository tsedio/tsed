import {OnDeserialize as D} from "@tsed/json-mapper";

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
 * @jsonMapper
 * @schema
 * @property
 * @ignore
 * @deprecated Use @OnDeserialize from @tsed/json-mapper
 */
export function OnDeserialize(fn: (value: any) => any) {
  return D(fn);
}
