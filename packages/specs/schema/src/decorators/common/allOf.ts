import {AnyJsonSchema} from "../../domain/JsonSchema";
import {JsonEntityFn} from "./jsonEntityFn";

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
