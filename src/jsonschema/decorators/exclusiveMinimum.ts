import {Minimum} from "./minimum";

/**
 * The value of `exclusiveMinimum` MUST be number, representing an exclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then the instance is valid only if it has a value strictly greater than (not equal to) `exclusiveMinimum`.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @ExclusiveMinimum(10)
 *    property: number;
 * }
 * ```
 * @param minimum
 * @param {boolean} exclusiveMinimum
 * @returns {Function}
 * @decorator
 */
export function ExclusiveMinimum(minimum: number, exclusiveMinimum: boolean = true) {
    return Minimum(minimum, exclusiveMinimum);
}