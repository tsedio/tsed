import {Type, useDecorators} from "@tsed/core";
import {JSONSchema6TypeName} from "json-schema";
import {Any} from "./any";
import {Property} from "./property";

/**
 * Set field as nullable.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Nullable(Date)
 *    property: Date | null;
 *
 *    @Nullable(String, Number, Boolean)
 *    property: string | number | boolean | null;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export function Nullable(...types: (JSONSchema6TypeName | Type<any> | any)[]) {
  return useDecorators(types.length === 1 && Property(types[0]), Any(null, ...types));
}
