import type {JsonSchema} from "../../domain/JsonSchema.js";
import {defineType} from "../../registries/JsonTypesContainer.js";

export default defineType({
  name: "set",
  priority: 1000,

  match(type: any) {
    return [Set, "set"].includes(type);
  },

  jsonType() {
    return "array";
  },

  init: (schema: JsonSchema) => schema.toCollection().target(Set).uniqueItems(true).items({}, true)
});
