import {uniq} from "@tsed/core";
import type {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import type {JsonSchema} from "../domain/JsonSchema";
import {alterRequiredGroups} from "../hooks/alterRequiredGroups";

function applyStringRule(obj: any, propSchema: JsonSchema) {
  if (!propSchema?.$allow.includes("")) {
    if (propSchema?.get("type") === "string") {
      const minLength = obj?.minLength;
      // Disallow empty string
      if (minLength === undefined) {
        return {
          ...obj,
          minLength: 1
        };
      }
    }
  }

  return obj;
}

function applyNullRule(obj: any, propSchema: JsonSchema) {
  if (propSchema?.$allow.includes(null)) {
    if (propSchema.isClass) {
      return {
        oneOf: [
          {
            type: "null"
          },
          obj
        ]
      };
    } else {
      return {
        ...obj,
        type: uniq([].concat(obj.type, "null" as any))
      };
    }
  }

  return obj;
}

function mapRequiredProps(obj: any, schema: JsonSchema, options: JsonSchemaOptions = {}) {
  const {useAlias} = options;
  const props = Object.keys(obj.properties || {});

  return (keys: string[], key: string) => {
    const aliasedKey = useAlias ? (schema.alias.get(key) as string) || key : key;

    if (props.includes(aliasedKey)) {
      const propSchema = schema.get("properties")[key];
      const serializeSchema = obj.properties[aliasedKey];

      obj.properties[aliasedKey] = applyNullRule(applyStringRule(serializeSchema, propSchema), propSchema);

      return keys.concat(aliasedKey);
    }

    return keys;
  };
}

function extractRequiredProps(obj: any, schema: JsonSchema, options: JsonSchemaOptions): string[] {
  let required: string[] = obj.required || [];

  required = [...required, ...schema.$required];

  if (schema.get("properties")) {
    required = Object.entries(schema.get("properties")).reduce((required, [key, prop]: [string, any]) => {
      if (prop && prop.$selfRequired !== undefined) {
        return prop.$selfRequired ? required.concat(key) : required.filter((k) => k === key);
      }

      return required;
    }, required);
  }

  return alterRequiredGroups(uniq(required), schema, options);
}

/**
 * @ignore
 */
export function getRequiredProperties(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  let required = extractRequiredProps(obj, schema, options);

  required = uniq(required).reduce(mapRequiredProps(obj, schema, options), []);

  if (required.length) {
    return {
      ...obj,
      required
    };
  }

  return obj;
}
