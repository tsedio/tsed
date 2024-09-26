import type {JsonEntityStore} from "@tsed/schema";
import {JsonEntityFn} from "@tsed/schema";
import {camelCase} from "change-case";

/**
 * Group the current property in tabs components.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Tabs(label: string) {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.schema.customKey("x-formiotabs", {
      key: camelCase(label),
      label
    });
  });
}
