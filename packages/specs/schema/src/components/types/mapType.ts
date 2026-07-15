import type {JsonSchema} from "../../domain/JsonSchema.js";
import {defineType} from "../../registries/JsonTypesContainer.js";

export default defineType({
  name: "map",
  priority: 1000,
  isCollection: true,

  match(type: any) {
    return [Map, this.name].includes(type);
  },

  jsonType() {
    return "object";
  },

  init(schema: JsonSchema) {
    return schema.toCollection().target(Map).additionalProperties({}, true);
  }
});
