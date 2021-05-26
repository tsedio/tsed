import {classOf, isArray, isClass, isObject} from "@tsed/core";
import {JsonEntityStore} from "../domain/JsonEntityStore";
import {JsonLazyRef} from "../domain/JsonLazyRef";
import {JsonSchema} from "../domain/JsonSchema";

export function mapToJsonSchema(item: any): any {
  if (isArray(item)) {
    return (item as any[]).map(mapToJsonSchema);
  }

  if (item instanceof JsonEntityStore || item instanceof JsonSchema || item instanceof JsonLazyRef) {
    return item;
  }

  if (classOf(item) !== Object && isClass(item)) {
    return JsonEntityStore.from(item).schema;
  }

  if (isObject(item)) {
    return JsonSchema.from(item as any);
  }

  return item;
}
