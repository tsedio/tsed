import {isTemporal} from "@tsed/core";

import {type JsonSchema} from "../../domain/index.js";
import {type AnyJsonType, defineType} from "../../registries/JsonTypesContainer.js";
import {getJsonType} from "../../utils/getJsonType.js";

export default defineType({
  name: "primitive",
  priority: 500,
  jsonType: getJsonType,

  match(type: any) {
    return ["number", "string", "boolean", "object", "integer", Object, Date, Boolean, Number, String].includes(type) || isTemporal(type);
  },

  init(schema: JsonSchema, type: AnyJsonType) {
    schema.target(type);

    if (type === "integer") {
      schema.integer();
    }

    if (!schema.has("properties")) {
      schema.properties({});
    }

    return schema;
  }
});
