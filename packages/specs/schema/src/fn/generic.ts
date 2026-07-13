import {Type} from "@tsed/core";

import {type GenericValue} from "../utils/generics.js";
import {from} from "./from.js";

export function generic(type: Type<any> = Object) {
  return {
    of(...generics: GenericValue[][]) {
      return from(type).genericOf(...generics);
    }
  };
}
