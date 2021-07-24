import {nameOf, Type} from "@tsed/core";
import {getJsonSchema, JsonEntityStore, JsonSchemaOptions} from "@tsed/schema";
import {execMapper} from "../registries/FormioMappersContainer";
import "../components";

export function getFormioSchema(model: Type<any> | JsonEntityStore, options: JsonSchemaOptions = {}) {
  const schema = getJsonSchema(model, {
    ...options,
    customKeys: true
  });

  return {
    machineName: nameOf(model).toLowerCase(),
    name: nameOf(model).toLowerCase(),
    title: nameOf(model),
    type: "form",
    display: "form",
    components: execMapper("properties", schema, {...options, definitions: schema.definitions})
  };
}
