import {JSONSchema6} from "json-schema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * Accept unknown properties on the deserialized model.
 *
 * ::: warning
 * For v6 user, use @@AdditionalProperties@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * @param value
 * @decorator
 * @validation
 * @swagger
 * @schema
 */
export function AdditionalProperties(value: boolean | JSONSchema6) {
  return decoratorSchemaFactory(schema => {
    schema.mapper.additionalProperties = value;
  });
}
