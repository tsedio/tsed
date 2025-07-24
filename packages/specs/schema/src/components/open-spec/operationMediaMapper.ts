import {JsonMedia} from "../../domain/JsonMedia.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

export function operationMediaMapper(jsonMedia: JsonMedia, options: JsonSchemaOptions) {
  return execMapper("map", [jsonMedia], {
    ...options,
    groups: [...(jsonMedia.schema().getGroups() || [])],
    groupsName: jsonMedia.schema().getGroupsName()
  });
}

registerJsonSchemaMapper("operationMedia", operationMediaMapper);
