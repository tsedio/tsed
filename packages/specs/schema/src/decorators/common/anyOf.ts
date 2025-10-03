import type {JsonSchema} from "../../domain/JsonSchema.js";
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
export function AnyOf(...anyOf: Parameters<JsonSchema["anyOf"]>[0]) {
  return JsonEntityFn((entity) => {
    entity.itemSchema.anyOf(anyOf);
  });
}
