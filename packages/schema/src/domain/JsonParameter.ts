import {cleanObject, Type} from "@tsed/core";
import {OS3Parameter} from "@tsed/openspec";
import {JsonSchemaOptions} from "../interfaces";
import {NestedGenerics, popGenerics} from "../utils/generics";
import {serializeItem} from "../utils/serializeJsonSchema";
import {JsonMap} from "./JsonMap";
import {isParameterType, JsonParameterTypes} from "./JsonParameterTypes";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

const IGNORE_OS2_PROPS = ["example", "examples", "title"];

export class JsonParameter extends JsonMap<OS3Parameter<JsonSchema>> implements NestedGenerics {
  nestedGenerics: Type<any>[][] = [];
  $schema: JsonSchema;

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

    parameter.required = parameter.required || this.get("in") === JsonParameterTypes.PATH;

    if (this.get("in") === JsonParameterTypes.FILES) {
      const isOpenApi = options.specType === SpecTypes.OPENAPI;

      const schema = {
        type: isOpenApi ? "string" : "file",
        format: isOpenApi ? "binary" : undefined
      };

      if (jsonSchema.type === "array") {
        jsonSchema.items = cleanObject({
          ...jsonSchema.items,
          ...schema
        });

        parameter.schema = jsonSchema;
      } else {
        parameter.schema = cleanObject({
          ...jsonSchema,
          ...schema
        });
      }

      return parameter;
    }

    if (options.specType === SpecTypes.OPENAPI) {
      if (["query"].includes(this.get("in")) && jsonSchema.$ref) {
        return this.refToParameters(parameter, options, schemas);
      }
    }

    if (options.specType === SpecTypes.SWAGGER) {
      if (!jsonSchema.$ref && Object.keys(jsonSchema).length === 1) {
        parameter.type = jsonSchema.type;
        return parameter;
      }

      if (["formData", "query"].includes(this.get("in"))) {
        if (jsonSchema.$ref) {
          return this.refToParameters(parameter, options, schemas);
        }

        if (jsonSchema.type === "array") {
          const {minLength, ...props} = jsonSchema;
          return cleanObject(
            {
              ...parameter,
              ...props,
              type: "array",
              collectionFormat: "multi",
              items: {
                type: "string"
              }
            },
            IGNORE_OS2_PROPS
          );
        }
      }

      if (this.get("in") !== "body") {
        return cleanObject(
          {
            ...parameter,
            ...jsonSchema
          },
          IGNORE_OS2_PROPS
        );
      }
    }

    parameter.schema = jsonSchema;

    return parameter;
  }

  private refToParameters(parameter: any, options: JsonSchemaOptions, schemas: any) {
    const schema = options.schemas![this.$schema.getName()];

    if (options.schemas![this.$schema.getName()] && !schemas[this.$schema.getName()]) {
      delete options.schemas![this.$schema.getName()];
    }

    return Object.entries(schema.properties || {}).reduce((params, [key, prop]: [string, any]) => {
      if (options.specType === SpecTypes.OPENAPI) {
        return [
          ...params,
          {
            ...parameter,
            name: key,
            required: (schema.required || []).includes(key),
            schema: prop
          }
        ];
      }

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
