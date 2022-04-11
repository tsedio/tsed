import {AnyJsonSchema} from "../../domain/JsonSchema";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 *
 * ::: warning
 * OneOf isn't supported by OS2
 * :::
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @classDecorator
 * @input
 * @param oneOf
 */
export function OneOf(...oneOf: AnyJsonSchema[]) {
  return JsonEntityFn((entity) => {
    entity.itemSchema.oneOf(oneOf);
    entity.type = Object;
  });
}
