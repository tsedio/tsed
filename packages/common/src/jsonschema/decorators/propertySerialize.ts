import {OnSerialize as S} from "@tsed/json-mapper";

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
 * @ignore
 * @deprecated Use @OnSerialize from @tsed/json-mapper
 */
export function OnSerialize(fn: (value: any) => any) {
  return S(fn);
}
