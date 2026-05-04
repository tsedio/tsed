import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Set a `$ref` value on the current schema property/parameter.
 *
 * Supports local references (`#/...`) and external URLs.
 *
 * @param ref - Reference URI
 * @decorator
 */
export function Ref(ref: string) {
  return JsonEntityFn((entity) => {
    entity.itemSchema.delete("type");
    entity.itemSchema.$ref(ref);
  });
}
