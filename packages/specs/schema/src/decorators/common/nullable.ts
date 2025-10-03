import {Type, useDecorators} from "@tsed/core";
import type {JSONSchema6TypeName} from "json-schema";

import {JsonSchema} from "../../domain/JsonSchema.js";
import {array} from "../../fn/collection.js";
import {JsonEntityFn} from "./jsonEntityFn.js";
import {OneOf} from "./oneOf.js";
import {Property} from "./property.js";

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
export function Nullable(type: JSONSchema6TypeName | Type<any> | any, ...types: (JSONSchema6TypeName | Type<any> | any)[]) {
  types = [type, ...types];

  if (type === Array) {
    return JsonEntityFn((entity) => {
      entity.schema.assign(
        array()
          .items({})
          .$comment(
            "Warning: you should not use @Nullable(Array), which leads to an incorrect schema. Use @Schema(array().items().nullable()) instead"
          )
          .nullable(true)
      );
    });
  }

  return useDecorators(types.length === 1 && !(type instanceof JsonSchema) && Property(types[0]), OneOf(null, ...types));
}
