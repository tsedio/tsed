import {Type} from "@tsed/core";
import {JsonSerializerOptions} from "../interfaces";
import {NestedGenerics, popGenerics} from "../utils/generics";
import {serializeItem} from "../utils/serializeJsonSchema";
import {JsonMap} from "./JsonMap";
import {JsonParameterTypes} from "./JsonParameterTypes";
import {JsonSchema} from "./JsonSchema";

export class JsonParameterOptions {
  name: string;
  description: string;
  in: JsonParameterTypes | string;
  required: boolean;
  schema: JsonSchema;
}

export class JsonParameter extends JsonMap<JsonParameterOptions> implements NestedGenerics {
  nestedGenerics: Type<any>[][] = [];
  $schema: JsonSchema;

  name(name: string): this {
    this.set("name", name);

    return this;
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  in(inType: string, expression: string | any = ""): this {
    this.set("in", inType);
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

  toJSON(options: JsonSerializerOptions = {}) {
    const {type, schema, ...parameter} = super.toJSON(options);
    const jsonSchema = serializeItem(this.$schema, {
      ...options,
      ...popGenerics(this)
    });

    if (!jsonSchema.$ref && (this.get("in") === "path" || Object.keys(jsonSchema).length === 1)) {
      parameter.type = jsonSchema.type;
    } else {
      parameter.schema = jsonSchema;
    }

    parameter.required = parameter.required || this.get("in") === "path";

    return parameter;
  }
}
