import {AnyJsonSchema} from "../../domain/JsonSchema.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 *
 * ::: warning
 * AnyOf isn't supported by OS2
 * :::
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @classDecorator
 * @input
 * @param anyOf
 */
export function AnyOf(...anyOf: AnyJsonSchema[]) {
  return JsonEntityFn((entity) => {
    entity.itemSchema.anyOf(anyOf);
  });
}
