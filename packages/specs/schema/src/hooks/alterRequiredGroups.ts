import type {JsonSchema} from "../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
/**
 * @ignore
 */
export function alterRequiredGroups(required: string[], schema: JsonSchema, options: JsonSchemaOptions): string[] {
  if (options.groups !== false) {
    return schema?.$hooks?.alter("requiredGroups", required, [options.groups]);
  }

  return required;
}
