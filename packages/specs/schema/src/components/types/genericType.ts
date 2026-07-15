import {getJsonType, JsonSchema} from "../../..";
import {type AnyJsonType, defineType} from "../../registries/JsonTypesContainer.js";

export default defineType({
  name: "generic",
  priority: 10,
  match: (type: AnyJsonType) => getJsonType(type) === "generic",

  init: (schema: JsonSchema, type: AnyJsonType) => schema.genericLabel(type as string)
});
