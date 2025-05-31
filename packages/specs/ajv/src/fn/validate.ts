import {inject} from "@tsed/di";
import {JsonSchema} from "@tsed/schema";

import {AjvService, type AjvValidateOptions} from "../services/AjvService.js";

/**
 * Validate a value against a JSON schema or a type.
 * @param value
 * @param options
 */
export function validate(value: unknown, options: AjvValidateOptions | JsonSchema) {
  return inject(AjvService).validate(value, options);
}
