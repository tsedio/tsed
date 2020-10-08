import {Type} from "@tsed/core";
import {OS3Parameter} from "@tsed/openspec";
import {JsonSchemaOptions} from "../interfaces";
import {NestedGenerics, popGenerics} from "../utils/generics";
import {serializeItem} from "../utils/serializeJsonSchema";
import {JsonMap} from "./JsonMap";
import {isParameterType} from "./JsonParameterTypes";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

export class JsonParameter extends JsonMap<OS3Parameter<JsonSchema>> implements NestedGenerics {
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
    this.set("in", inType.toLowerCase());
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

  toJSON(options: JsonSchemaOptions = {}) {
    if (!isParameterType(this.get("in"))) {
      return null;
    }

    const schemas = {...options.schemas};
    const {type, schema, ...parameter} = super.toJSON(options);
    const jsonSchema = serializeItem(this.$schema, {
      ...options,
      ...popGenerics(this)
    });

    parameter.required = parameter.required || this.get("in") === "path";

    if (!jsonSchema.$ref && (this.get("in") === "path" || Object.keys(jsonSchema).length === 1)) {
      parameter.type = jsonSchema.type;
    } else if (options.spec === SpecTypes.SWAGGER && this.get("in") === "query") {
      if (jsonSchema.$ref) {
        return this.refToParameters(parameter, options, schemas);
      }

      if (jsonSchema.type === "array") {
        return {
          ...parameter,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "string"
          }
        };
      }

      return {
        ...parameter,
        ...jsonSchema
      };
    } else {
      parameter.schema = jsonSchema;
    }

    return parameter;
  }

  private refToParameters(parameter: any, options: JsonSchemaOptions, schemas: any) {
    const schema = options.schemas[this.$schema.getName()];

    if (options.schemas[this.$schema.getName()] && !schemas[this.$schema.getName()]) {
      delete options.schemas[this.$schema.getName()];
    }

    return Object.entries(schema.properties || {}).reduce((params, [key, prop]: [string, any]) => {
      return [
        ...params,
        {
          ...parameter,
          name: key,
          required: (schema.required || []).includes(key),
          ...prop
        }
      ];
    }, []);
  }
}
