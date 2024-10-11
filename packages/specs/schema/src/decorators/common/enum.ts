import type {JSONSchema6Type} from "json-schema";

import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

function EnumFn(...enumValues: (JSONSchema6Type | any)[]): Function;
function EnumFn(enumValue: JSONSchema6Type | any, ...enumValues: JSONSchema6Type[]) {
  return JsonEntityFn((store) => {
    store.itemSchema.enum(enumValue, ...enumValues);
  });
}

/**
 * The enum keyword is used to restrict a value to a fixed set of values.
 * It must be an array with at least one element, where each element is unique.
 *
 * Elements in the array might be of any value, including null.
 *
 * ::: warning
 * For v6 user, use @@Enum@@ from @tsed/schema instead of @tsed/platform-http.
 * :::
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Enum("value1", "value2")
 *    property: "value1" | "value2";
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "string",
 *       "enum": ["value1", "value2"]
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Enum("value1", "value2")
 *    property: ("value1" | "value2")[];
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "array",
 *       "items": {
 *          "type": "string",
 *          "enum": ["value1", "value2"]
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * ### With Typescript Enum
 *
 * ```typescript
 * enum SomeEnum {
 *    ENUM_1 = "enum1",
 *    ENUM_2 = "enum2"
 * }
 *
 * class Model {
 *    @Enum(SomeEnum)
 *    property: SomeEnum;
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *        "type": "string",
 *        "enum": ["enum1", "enum2"]
 *     }
 *   }
 * }
 * ```
 *
 * @param {string | number | boolean | {}} enumValue
 * @param enumValues
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @ajv-errors
 */

export const Enum = withErrorMsg("enum", EnumFn);
