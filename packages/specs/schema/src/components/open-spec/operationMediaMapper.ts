import type {JsonMedia} from "../../domain/JsonMedia.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

export function operationMediaMapper(jsonMedia: JsonMedia, options: JsonSchemaOptions) {
  let groups = [...(jsonMedia.groups || [])];

  return execMapper("map", [jsonMedia], {...options, groups, groupsName: jsonMedia.groupsName});
}

registerJsonSchemaMapper("operationMedia", operationMediaMapper);
