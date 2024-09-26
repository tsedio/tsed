import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

export function itemMapper(value: any, options: JsonSchemaOptions) {
  return value && value.isClass ? execMapper("class", [value], options) : execMapper("any", [value], options);
}

registerJsonSchemaMapper("item", itemMapper);
