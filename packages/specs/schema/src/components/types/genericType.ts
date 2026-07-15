import type {JsonSchema} from "../../domain/index.js";
import {type AnyJsonType, defineType} from "../../registries/JsonTypesContainer.js";
import {getJsonType} from "../../utils/getJsonType.js";

export default defineType({
  name: "generic",
  priority: 10,
  match: (type: AnyJsonType) => getJsonType(type) === "generic",

  init: (schema: JsonSchema, type: AnyJsonType) => schema.genericLabel(type as string)
});
