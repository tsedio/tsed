import {JSONSchema6} from "json-schema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * Accept unknown properties on the deserialized model
 * @param value
 * @constructor
 */
export function AdditionalProperties(value: boolean | JSONSchema6) {
  return decoratorSchemaFactory(schema => {
    schema.mapper.additionalProperties = value;
  });
}
