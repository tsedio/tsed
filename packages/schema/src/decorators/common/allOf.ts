import {JsonSchema} from "../../domain/JsonSchema";
import {JSONSchema6} from "json-schema";
import {Schema} from "./schema";

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
export function AllOf(...allOf: (Partial<JSONSchema6> | JsonSchema)[]) {
  return Schema({
    allOf: allOf as any[]
  });
}
