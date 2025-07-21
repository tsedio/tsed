import {setValue} from "@tsed/core";
import {pascalCase} from "change-case";
import type {JSONSchema7} from "json-schema";

import type {JsonSchema} from "../domain/JsonSchema.js";
import {SpecTypes} from "../domain/SpecTypes.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {mergeSchema} from "./mergeSchema.js";

export function getSchemaFromRef($ref: string | undefined, options: JsonSchemaOptions): JSONSchema7 | undefined {
  const {components} = options;

  if (components?.schemas && $ref) {
    const host = getHost(options);
    const refName = $ref.replace(`${host}/`, "");

    return components.schemas[refName];
  }
}

/**
 * ignore
 * @param options
 */
function getHost(options: JsonSchemaOptions) {
  const {host = `#/${[SpecTypes.OPENAPI, SpecTypes.ASYNCAPI].includes(options.specType!) ? "components/schemas" : "definitions"}`} =
    options;

  return host;
}

/**
 * @ignore
 */
export function createRefName(name: string, options: JsonSchemaOptions) {
  if (options.groups && options.groups.length) {
    return pascalCase(`${name} ${options.groupsName || options.groups.join(" ")}`);
  }

  return name;
}

/**
 * @ignore
 */
export function createRef(name: string, schema: JsonSchema, options: JsonSchemaOptions) {
  const host = getHost(options);

  return mergeSchema(
    {
      $ref: `${host}/${name}`
    },
    {
      ...(schema.isReadOnly ? {readOnly: true} : {}),
      ...(schema.isWriteOnly ? {writeOnly: true} : {})
    }
  );
}

/**
 * @ignore
 */
export function toRef(value: JsonSchema, schema: JSONSchema7 | undefined | null, options: JsonSchemaOptions) {
  const name = createRefName(value.getName(), options);

  if (schema) {
    setValue(options, `components.schemas.${name}`, schema);
  }

  return createRef(name, value, options);
}
