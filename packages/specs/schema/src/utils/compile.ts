import {Type} from "@tsed/core";

import {JsonParameterStore} from "../domain/JsonParameterStore.js";
import {JsonSchema} from "../domain/JsonSchema.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {getJsonSchema} from "./getJsonSchema.js";

/**
 * Compile a class, parameter store, or `JsonSchema` into a plain JSON schema object.
 *
 * This is an alias of `getJsonSchema(...)`.
 *
 * @param model Class, parameter store, or `JsonSchema` to compile.
 * @param options JSON schema generation options.
 * @returns Compiled JSON schema object.
 */
export function compile(model: Type<any> | JsonParameterStore | JsonSchema, options: JsonSchemaOptions = {}) {
  return getJsonSchema(model, options);
}
