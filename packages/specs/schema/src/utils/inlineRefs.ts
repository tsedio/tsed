import {isPlainObject} from "@tsed/core";
import {mergeSchema} from "./mergeSchema.js";

function getLocalReference(schema: Record<string, any>, $ref: string) {
  if (!$ref.startsWith("#/")) {
    return;
  }

  return $ref
    .slice(2)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
    .reduce<any>((value, segment) => value?.[segment], schema);
}

function inline(value: any, root: Record<string, any>, resolving: Set<string>): any {
  if (Array.isArray(value)) {
    return value.map((item) => inline(item, root, resolving));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const {$ref, ...siblings} = value;
  const target = typeof $ref === "string" && !resolving.has($ref) ? getLocalReference(root, $ref) : undefined;

  if (target) {
    const nextResolving = new Set(resolving).add($ref);

    return {
      ...inline(target, root, nextResolving),
      ...inline(siblings, root, resolving)
    };
  }

  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, inline(item, root, resolving)]));
}

function flattenAllOf(value: any): any {
  if (Array.isArray(value)) {
    return value.map(flattenAllOf);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const schema = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, flattenAllOf(item)]));

  if (!Array.isArray(schema.allOf)) {
    return schema;
  }

  const {allOf, ...rest} = schema;

  return allOf.reduce((merged: any, item: any) => mergeSchema(merged, item), rest);
}

function hasLocalRefs(value: any): boolean {
  if (Array.isArray(value)) {
    return value.some(hasLocalRefs);
  }

  if (!isPlainObject(value)) {
    return false;
  }

  return (typeof value.$ref === "string" && value.$ref.startsWith("#/")) || Object.values(value).some(hasLocalRefs);
}

/**
 * Returns a copy of a JSON Schema with resolvable local references inlined.
 * Circular and external references are preserved.
 *
 * @ignore
 */
export function inlineRefs(schema: Record<string, any>) {
  const inlined = flattenAllOf(inline(schema, schema, new Set()));
  const {definitions, ...result} = inlined;

  return hasLocalRefs(result) ? inlined : result;
}
