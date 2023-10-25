import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";

export function itemMapper(value: any, options: JsonSchemaOptions) {
  return value && value.isClass ? execMapper("class", [value], options) : execMapper("any", [value], options);
}

registerJsonSchemaMapper("item", itemMapper);
