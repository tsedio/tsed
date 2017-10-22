import {Maximum} from "./maximum";

/**
 * The value of `exclusiveMaximum` MUST be number, representing an exclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then the instance is valid only if it has a value strictly less than (not equal to) `exclusiveMaximum`.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @ExclusiveMaximum(10)
 *    property: number;
 * }
 * ```
 *
 * @param maximum
 * @param {boolean} exclusiveMaximum
 * @returns {Function}
 * @decorator
 */
export function ExclusiveMaximum(maximum: number, exclusiveMaximum: boolean = true) {
    return Maximum(maximum, exclusiveMaximum);
}