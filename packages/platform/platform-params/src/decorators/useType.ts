import {Type} from "@tsed/core";
import {Any, CollectionOf, type JsonParameterStore} from "@tsed/schema";

import {ParamFn} from "./paramFn.js";

function shouldFallBackToAny(entity: JsonParameterStore) {
  if (entity.itemSchema.has("allOf") || entity.itemSchema.has("anyOf") || entity.itemSchema.has("oneOf")) {
    return false;
  }

  return entity.isCollection && entity.type === Object && [undefined, "object"].includes(entity.itemSchema.get("type"));
}

/**
 * Set the type of the item collection.
 *
 * Prefer @@CollectionOf@@ usage.
 *
 * @param useType
 * @decorator
 * @operation
 * @input
 * @alias CollectionOf
 */
export function UseType(useType: undefined | any | Type<any>) {
  return ParamFn((entity, parameters) => {
    if (useType) {
      return CollectionOf(useType);
    }

    if (shouldFallBackToAny(entity)) {
      Any()(...parameters);
    }
  });
}
