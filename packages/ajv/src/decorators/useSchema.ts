import {StoreMerge} from "@tsed/core";
import {JSONSchema6} from "json-schema";
import {AjvValidationPipe} from "../pipes/AjvValidationPipe";

/**
 * Use raw JsonSchema to validate parameter.
 * @param schema
 * @constructor
 */
export function UseSchema(schema: JSONSchema6) {
  return StoreMerge(AjvValidationPipe, {schema});
}
