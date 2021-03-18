import {pascalCase} from "change-case";
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
export function createRef(name: string, options: JsonSchemaOptions) {
  const host = getHost(options);
  return {
    $ref: `${host}/${name}`
  };
}
