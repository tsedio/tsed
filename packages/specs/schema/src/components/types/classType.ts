import {isClass, isFunction} from "@tsed/core";

import {JsonSchema} from "../../..";
import {type AnyJsonType, defineType} from "../../registries/JsonTypesContainer.js";

export default defineType({
  name: "class",
  priority: 20,
  match: (type: AnyJsonType) => isClass(type) || isFunction(type),
  init: (schema: JsonSchema, type: AnyJsonType) => schema.unsetType().target(type).properties({})
});
