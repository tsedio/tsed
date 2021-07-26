import {pascalCase} from "change-case";
import type {JsonSchema} from "../domain/JsonSchema";
import {SpecTypes} from "../domain/SpecTypes";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";

/**
 * ignore
 * @param options
 */
function getHost(options: JsonSchemaOptions) {
  const {host = `#/${options.specType === "openapi3" ? "components/schemas" : "definitions"}`} = options;

  return host;
}

/**
 * @ignore
 */
export function createRefName(name: string, options: JsonSchemaOptions) {
  if (options.groups && options.groups.length) {
    return pascalCase(`${name} ${options.groups.join(" ")}`);
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

  if (schema.nullable) {
    switch (options.specType) {
      case SpecTypes.OPENAPI:
        return {
          nullable: true,
          allOf: [ref]
        };
      case SpecTypes.JSON:
        return {
          oneOf: [{type: "null"}, ref]
        };
      case SpecTypes.SWAGGER: // unsupported
        break;
    }
  }

  return ref;
}

/**
 * @ignore
 */
export function toRef(value: JsonSchema, schema: any, options: JsonSchemaOptions) {
  const name = createRefName(value.getName(), options);

  options.schemas![value.getName()] = schema;

  return createRef(name, value, options);
}
