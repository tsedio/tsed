import type {Type} from "@tsed/core";

import {JsonEntityStore} from "../domain/JsonEntityStore.js";
import {JsonLazyRef} from "../domain/JsonLazyRef.js";

/**
 * Declare a sub schema which will be resolved later. Use this function when you have a circular reference between two schemes.
 */
export function lazyRef(cb: () => Type<any>) {
  try {
    // solve issue with a self referenced model
    if (cb()) {
      // type is already accessible
      return JsonEntityStore.from(cb()).schema as any;
    }
  } catch (er) {}

  return new JsonLazyRef(cb);
}
