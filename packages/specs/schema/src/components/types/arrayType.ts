import {type JsonSchema} from "../../..";
import {defineType} from "../../registries/JsonTypesContainer.js";

export default defineType({
  name: "array",
  priority: 1000,
  isCollection: true,

  match(type: any) {
    return [Array, "array"].includes(type);
  },

  jsonType() {
    return "array";
  },

  init(schema: JsonSchema) {
    return schema.toCollection().target(Array).items(schema.itemSchema({}), true);
  }
});
