import type {AnyJsonSchema} from "../../domain/JsonSchema.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Accept unknown properties on the deserialized model.
 *
 * @param schema
 * @decorator
 * @validation
 * @swagger
 * @schema
 */
export function AdditionalProperties(schema: boolean | AnyJsonSchema) {
  return JsonEntityFn((entity, parameters) => {
    entity.itemSchema.additionalProperties(schema);
  });
}
