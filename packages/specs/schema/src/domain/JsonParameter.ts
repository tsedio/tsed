import {OpenSpecHash, OpenSpecRef, OS3Example, OS3Parameter} from "@tsed/openspec";

import {Partial} from "../decorators/operations/partial.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {JsonMap} from "./JsonMap.js";
import {formatParameterType} from "./JsonParameterTypes.js";
import {JsonSchema} from "./JsonSchema.js";

export class JsonParameter extends JsonMap<OS3Parameter<JsonSchema>> {
  $kind = "operationInParameter";
  expression: string;

  constructor(obj: Partial<OS3Parameter<JsonSchema>> = {}) {
    super(obj);
    if (!this.has("schema")) {
      this.set("schema", new JsonSchema());
    }
  }

  getName() {
    const name = this.get("name");

    if (this.get("in") === "files") {
      return name.split(".")[0];
    }

    return name;
  }

  name(name: string): this {
    this.set("name", name);

    return this;
  }

  examples(examples: OpenSpecHash<OS3Example | OpenSpecRef>) {
    super.set("examples", examples);

    return this;
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  in(inType: string, expression: string | any = ""): this {
    this.set("in", formatParameterType(inType));
    this.expression = expression;

    return this;
  }

  required(required: boolean): this {
    this.set("required", required);

    return this;
  }

  public schema(): JsonSchema;
  public schema(schema: JsonSchema): this;
  public schema(schema?: JsonSchema): JsonSchema | this {
    if (schema) {
      this.set("schema", schema);
      return this;
    }

    return this.get("schema");
  }

  itemSchema(schema?: JsonSchema) {
    if (this.schema().isCollection) {
      schema && this.schema().itemSchema(schema);

      return this.schema().itemSchema();
    }

    schema && this.schema(schema);
    // non-collection: delegate to the main schema
    return this.schema();
  }

  toJSON(options?: JsonSchemaOptions) {
    return execMapper("operationInParameter", [this], options);
  }
}
