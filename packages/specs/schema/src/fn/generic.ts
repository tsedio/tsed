import {Type} from "@tsed/core";

import {type GenericValue} from "../domain/Generics.js";
import {from} from "./from.js";

export function generic(type: Type<any> = Object) {
  return {
    of(...generics: GenericValue[][]) {
      return from(type).genericOf(...generics);
    }
  };
}
