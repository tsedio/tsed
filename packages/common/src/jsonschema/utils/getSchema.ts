import {Type} from "@tsed/core";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";

export function getJsonSchema(target: Type<any>) {
  return JsonSchemesRegistry.getSchemaDefinition(target);
}
