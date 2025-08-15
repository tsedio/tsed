import {cleanObject} from "@tsed/core/utils/cleanObject.js";
import {isObject} from "@tsed/core/utils/isObject.js";
import {uniq} from "@tsed/core/utils/uniq.js";
import type {JSONSchema7, JSONSchema7Definition} from "json-schema";

type Properties = {
  [key: string]: JSONSchema7Definition;
};

function mergeProps(properties1?: Properties, properties2?: Properties): Properties {
  if (!properties1 || !properties2) {
    return properties1 || properties2 || {};
  }

  const keys = [...new Set(Object.keys(properties1 || []).concat(Object.keys(properties2 || [])))];

  return keys.reduce((acc, key) => {
    if (properties1?.[key] && properties2?.[key]) {
      acc[key] = mergeSchema(properties1[key] as JSONSchema7, properties2[key] as JSONSchema7);
    } else if (properties1?.[key]) {
      acc[key] = properties1[key];
    } else if (properties2?.[key]) {
      acc[key] = properties2[key];
    }

    return acc;
  }, {} as Properties);
}

function getSchemaType(schema: any) {
  return schema.type || (schema.items && "array") || ((schema.properties || schema.additionalProperties) && "object") || "$any";
}

function mergeManyOf(kind: "allOf" | "anyOf" | "oneOf", schema1: JSONSchema7, schema2: JSONSchema7) {
  const {[kind]: kind1, ...$rest1} = schema1;
  const {[kind]: kind2, ...$rest2} = schema2;
  let hasRef = false;

  const map = [kind1, $rest1, kind2, $rest2]
    .flat()
    .filter(Boolean)
    .reduce((map, schema: JSONSchema7, index) => {
      schema = cleanObject(schema as any);

      if (schema.$ref) {
        hasRef = true;
        return map.set(schema.$ref, schema);
      }

      if (Object.keys(schema).length === 0) {
        return map;
      }

      if (schema.type === "object" && Object.keys(schema).length === 2) {
        if ("writeOnly" in schema || "readOnly" in schema || "deprecated" in schema) {
          schema = {...schema, type: undefined} as JSONSchema7;
        }
      }

      const type = getSchemaType(schema);

      if (type === "array") {
        map.set("array_" + index, schema);
        return map;
      }

      if (map.has(type)) {
        if (kind === "allOf") {
          // we can merge allOf schemas to optimize the schema
          map.set(type, mergeSchema(map.get(type)!, schema));
          return map;
        }

        map.set(type + "_" + index, schema);

        return map;
      }

      return map.set(type, schema);
    }, new Map<string, JSONSchema7>());

  const rest = map.get("$any");
  map.delete("$any");

  const of = Array.from(map.values()) as JSONSchema7[];

  return cleanObject(
    of.length > 1 || (hasRef && rest)
      ? {
          ...rest,
          [kind]: of
        }
      : {
          ...rest,
          ...of[0]!
        }
  ) as JSONSchema7;
}

export function mergeSchema(schema1: JSONSchema7, schema2: JSONSchema7): JSONSchema7 {
  if (schema1.$ref && schema2.$ref && schema1.$ref === schema2.$ref) {
    return schema1; // If both refs are the same, return one of them
  }

  // Handle allOf, oneOf, anyOf
  if (schema1.allOf || schema2.allOf) {
    return mergeManyOf("allOf", schema1, schema2);
  }

  if (schema1.oneOf || schema2.oneOf) {
    const schema = mergeManyOf("oneOf", schema1, schema2);

    if ("discriminator" in schema1 || "discriminator" in schema2) {
      // If either schema has a discriminator, we should not merge oneOf
      return {
        ...schema,
        discriminator: (schema1 as any).discriminator || (schema2 as any).discriminator,
        required: uniq([...(schema1.required || []), ...(schema2.required || [])])
      } as JSONSchema7;
    }

    return schema;
  }

  if (schema1.anyOf || schema2.anyOf) {
    return mergeManyOf("anyOf", schema1, schema2);
  }

  if (schema1.$ref || schema2.$ref) {
    return mergeManyOf("allOf", schema1, schema2);
  }

  const mergedSchema: JSONSchema7 = {...schema1, ...schema2};

  if (schema1.properties || schema2.properties) {
    // Handle properties
    mergedSchema.properties = mergeProps(schema1.properties, schema2.properties);
  }

  if (isObject(schema1.additionalProperties) && isObject(schema2.additionalProperties)) {
    // Right now we only merge additionalProperties if both schemas have it as an object
    mergedSchema.additionalProperties = {
      ...(schema1.additionalProperties as JSONSchema7),
      ...(schema2.additionalProperties as JSONSchema7)
    };
  }

  if (schema1.required || schema2.required) {
    // Handle required fields
    mergedSchema.required = uniq([...(schema1.required || []), ...(schema2.required || [])]);
  }

  return mergedSchema;
}
