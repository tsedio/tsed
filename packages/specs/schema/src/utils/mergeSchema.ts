import {isObject, uniq} from "@tsed/core";
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

function mergeManyOf(kind: "allOf" | "anyOf" | "oneOf", schema1: JSONSchema7, schema2: JSONSchema7) {
  const refs = new Set();

  let of = [...(schema1[kind] || [schema1]), ...(schema2[kind] || [schema2])].filter((schema: any) => {
    if ("$ref" in schema) {
      if (refs.has(schema.$ref)) {
        return false;
      }

      refs.add(schema.$ref);

      return true;
    }
    return Object.keys(schema).length > 0;
  }) as JSONSchema7[];

  if (of.length > 2) {
    of = of.reduce((current, item: JSONSchema7, index) => {
      if (item.$ref) {
        return current.concat(item);
      }

      if (current.at(-1)?.type === item.type && item.type !== "array") {
        current[current.length - 1] = mergeSchema(current.at(-1) as JSONSchema7, item);
        return current;
      }

      return current.concat(item);
    }, [] as JSONSchema7[]);
  }

  return of.length > 1
    ? {
        [kind]: of,
        ...(((schema1 as any).nullable || (schema2 as any).nullable ? {nullable: true} : {}) as any)
      }
    : (of[0]! as JSONSchema7);
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
