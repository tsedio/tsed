import {JsonSchema, JsonSchemaObject, Refs} from "../Types.js";
import {half} from "../utils/half.js";
import {parseSchema} from "./parseSchema.js";

const originalIndex = Symbol("Original index");

const ensureOriginalIndex = (arr: JsonSchema[]) => {
  let newArr = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (typeof item === "boolean") {
      newArr.push(item ? {[originalIndex]: i} : {[originalIndex]: i, not: {}});
    } else if (originalIndex in item) {
      return arr;
    } else {
      newArr.push({...item, [originalIndex]: i});
    }
  }

  return newArr;
};

/**
 * Parses an `allOf` schema by intersecting all child schemas, preserving evaluation order for accurate metadata.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export function parseAllOf(schema: JsonSchemaObject & {allOf: JsonSchema[]}, refs: Refs): string {
  if (schema.allOf.length === 0) {
    return "z.never()";
  } else if (schema.allOf.length === 1) {
    const item = schema.allOf[0];

    return parseSchema(item, {
      ...refs,
      path: [...refs.path, "allOf", (item as any)[originalIndex]]
    });
  } else {
    const [left, right] = half(ensureOriginalIndex(schema.allOf)) as any;

    return `z.intersection(${parseAllOf({allOf: left}, refs)}, ${parseAllOf(
      {
        allOf: right
      },
      refs
    )})`;
  }
}
