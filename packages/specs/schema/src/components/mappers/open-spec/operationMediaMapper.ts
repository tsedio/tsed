import {JsonMedia} from "../../../domain/JsonMedia.js";
import {JsonSchemaOptions} from "../../../domain/JsonSchemaOptions.js";
import {defineSchemaMapper, execMapper} from "../../../registries/JsonSchemaMapperContainer.js";

export function operationMediaMapper(jsonMedia: JsonMedia, options: JsonSchemaOptions) {
  return execMapper("map", [jsonMedia], {
    ...options,
    groups: [...(jsonMedia.schema().getGroups() || [])],
    groupsName: jsonMedia.schema().getGroupsName()
  });
}

defineSchemaMapper({type: "operationMedia", transform: operationMediaMapper});
