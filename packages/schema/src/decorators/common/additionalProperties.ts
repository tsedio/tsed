import {Type} from "@tsed/core";
import {JsonSchema, JsonSchemaObject} from "../../domain/JsonSchema";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Accept unknown properties on the deserialized model.
 *
 * @param schema
 * @decorator
 * @validation
 * @swagger
 * @schema
 */
export function AdditionalProperties(schema: boolean | JsonSchemaObject | JsonSchema | Type<any>) {
  return JsonEntityFn((entity, parameters) => {
    entity.itemSchema.additionalProperties(schema);
  });
}
