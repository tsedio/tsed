import {JsonMedia} from "../domain/JsonMedia";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";

export function operationMediaMapper(jsonMedia: JsonMedia, options: JsonSchemaOptions) {
  let groups = [...(jsonMedia.groups || [])];

  return execMapper("map", jsonMedia, {...options, groups, groupsName: jsonMedia.groupsName});
}

registerJsonSchemaMapper("operationMedia", operationMediaMapper);
