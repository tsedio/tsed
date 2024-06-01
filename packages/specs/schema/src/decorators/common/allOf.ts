import {AnyJsonSchema} from "../../domain/JsonSchema.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @classDecorator
 * @input
 * @param allOf
 */
export function AllOf(...allOf: AnyJsonSchema[]) {
  return JsonEntityFn((entity) => {
    entity.itemSchema.allOf(allOf);
  });
}
