import {Type} from "@tsed/core";
import {ParamFn} from "./paramFn";

/**
 * Set the type of the item colllection.
 *
 * Prefer @@CollectionOf@@ usage.
 *
 * @param type
 * @decorator
 * @operation
 * @input
 * @alias CollectionOf
 */
export function UseType(type: any | Type<any>) {
  return ParamFn((param) => {
    param.type = type;
  });
}
