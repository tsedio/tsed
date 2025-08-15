import {isArray, isClass} from "@tsed/core";
import {OS3MediaType} from "@tsed/openspec";

import {Partial} from "../decorators/operations/partial.js";
import {JsonMap} from "./JsonMap.js";
import {JsonSchema} from "./JsonSchema.js";

export class JsonMedia extends JsonMap<any> {
  $kind: string = "operationMedia";

  constructor(obj: Partial<OS3MediaType<JsonSchema>> = {}) {
    super(obj);
    if (!this.has("schema")) {
      this.set("schema", new JsonSchema());
    }
  }

  schema(schema?: JsonSchema) {
    schema && this.set("schema", schema);

    return this.get("schema") as JsonSchema;
  }

  examples(examples?: any) {
    examples && this.set("examples", examples);

    return this;
  }

  type(type: any) {
    if (type) {
      if (isArray(type)) {
        this.schema().oneOf(type.map((type) => ({type})));
      } else {
        if (isClass(type)) {
          this.schema().type("object");
          this.schema().itemSchema(type);
        } else {
          this.schema().type(type);
        }
      }
    }

    return this;
  }
}
