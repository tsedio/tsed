import {Type} from "@tsed/core";
import {OpenSpecHash, OpenSpecRef, OS3Example, OS3Parameter} from "@tsed/openspec";

import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {NestedGenerics} from "../utils/generics.js";
import {JsonMap} from "./JsonMap.js";
import {formatParameterType} from "./JsonParameterTypes.js";
import {JsonSchema} from "./JsonSchema.js";

export class JsonParameter extends JsonMap<OS3Parameter<JsonSchema>> implements NestedGenerics {
  $kind = "operationInParameter";

  nestedGenerics: Type<any>[][] = [];
  groups: string[];
  groupsName: string;
  $schema: JsonSchema;
  expression: string;

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

  schema(schema: JsonSchema): this {
    this.$schema = schema;

    return this;
  }

  toJSON(options?: JsonSchemaOptions) {
    return execMapper("operationInParameter", [this], options);
  }
}
