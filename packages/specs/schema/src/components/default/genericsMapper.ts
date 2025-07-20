import {isObject, type Type} from "@tsed/core";
import type {JSONSchema7} from "json-schema";

import {VendorKeys} from "../../constants/VendorKeys.js";
import type {JsonLazyRef} from "../../domain/JsonLazyRef.js";
import {JsonSchema} from "../../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {toRef} from "../../utils/ref.js";

function getNestedSchema(propertyKey: string, schema: JsonSchema | JsonLazyRef, options: JsonSchemaOptions): JSONSchema7 | null {
  try {
    if ("isLazyRef" in schema) {
      return null;
    }

    if (schema.isGeneric) {
      const genericLabel = schema.get(VendorKeys.GENERIC_LABEL);
      let [model, next]: [Type | JsonSchema, any] = ([] as any).concat(options.generics?.[genericLabel]);

      if (!model) {
        return null;
      }

      const refSchema = JsonSchema.from(model);

      const modelSchema = execMapper("schema", [refSchema], {
        ...options,
        generics: next
      });

      if (next || !refSchema.isClass) {
        return modelSchema;
      }

      return toRef(refSchema, modelSchema, options);
    }

    if (schema?.has("items")) {
      const nestedSchema = getNestedSchema(propertyKey, schema.get("items")!, options);

      if (nestedSchema) {
        return {
          type: "array",
          items: nestedSchema as JSONSchema7
        };
      }
    }

    if (schema.has("additionalProperties") && isObject(schema.get("additionalProperties"))) {
      const nestedSchema = getNestedSchema(propertyKey, schema.get("additionalProperties")!, options);

      if (nestedSchema) {
        return {
          type: "object",
          additionalProperties: nestedSchema
        };
      }
    }
  } catch (er) {
    console.error(`Error while processing generics for property "${propertyKey}":`, er);
  }
  return null;
}

/**
 * @ignore
 */
export function genericsMapper(baseObj: JSONSchema7, schema: JsonSchema, options: JsonSchemaOptions) {
  if (schema.genericLabels?.length && schema.has("properties")) {
    const properties = schema.get("properties") as Record<string, JsonSchema>;
    let hasProps = false;

    const additionalObj = Object.entries(properties || {}).reduce((obj, [propertyKey, jsonSchema]) => {
      const nestedSchema = getNestedSchema(propertyKey, jsonSchema, options);

      if (nestedSchema) {
        (obj as any)[propertyKey] = nestedSchema;
        hasProps = true;
      }

      return obj;
    }, {} as JSONSchema7);

    if (hasProps) {
      return {
        allOf: [toRef(schema, baseObj, options), {properties: additionalObj, type: "object"}]
      };
    }

    return baseObj;
  }

  return baseObj;
}

registerJsonSchemaMapper("generics", genericsMapper);
