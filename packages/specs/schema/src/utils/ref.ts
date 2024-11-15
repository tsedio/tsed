import {cleanObject, setValue} from "@tsed/core";
import {pascalCase} from "change-case";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {SpecTypes} from "../domain/SpecTypes.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {anyOf} from "./from.js";

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
  const ref = {
    $ref: `${host}/${name}`
  };

  const readOnly = schema.isReadOnly;
  const writeOnly = schema.isWriteOnly;

  return cleanObject({
    readOnly: readOnly ? true : undefined,
    writeOnly: writeOnly ? true : undefined,
    ...(readOnly || writeOnly
      ? {
          anyOf: [ref]
        }
      : ref)
  });
}

/**
 * @ignore
 */
export function toRef(value: JsonSchema, schema: unknown | undefined, options: JsonSchemaOptions) {
  const name = createRefName(value.getName(), options);

  if (schema) {
    setValue(options, `components.schemas.${name}`, schema);
  }

  return createRef(name, value, options);
}
