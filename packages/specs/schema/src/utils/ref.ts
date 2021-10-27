import {pascalCase} from "change-case";
import type {JsonSchema} from "../domain/JsonSchema";
import {SpecTypes} from "../domain/SpecTypes";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {cleanObject} from "@tsed/core";

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

  const nullable = schema.nullable;
  const readOnly = schema.get ? schema.get("readOnly") : undefined;

  if (nullable || readOnly) {
    switch (options.specType) {
      case SpecTypes.OPENAPI:
        return cleanObject({
          nullable: nullable ? true : undefined,
          readOnly: readOnly ? true : undefined,
          allOf: [ref]
        });
      case SpecTypes.JSON:
        return cleanObject({
          readOnly,
          oneOf: [nullable && {type: "null"}, ref].filter(Boolean)
        });
      case SpecTypes.SWAGGER: // unsupported
        if (readOnly) {
          return {
            readOnly,
            allOf: [ref]
          };
        }
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
