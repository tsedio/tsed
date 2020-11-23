import {JsonSchema} from "../../domain/JsonSchema";
import {JSONSchema6} from "json-schema";
import {Schema} from "./schema";

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
export function AnyOf(...anyOf: (Partial<JSONSchema6> | JsonSchema)[]) {
  return Schema({
    anyOf: anyOf as any[]
  });
}
