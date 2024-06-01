import {Type} from "@tsed/core";
import {Any, CollectionOf} from "@tsed/schema";
import {ParamFn} from "./paramFn.js";

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

    if (entity.isCollection && entity.type === Object && [undefined, "object"].includes(entity.itemSchema.get("type"))) {
      Any()(...parameters);
    }
  });
}
