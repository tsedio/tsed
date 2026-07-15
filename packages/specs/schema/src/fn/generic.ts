import {Type} from "@tsed/core";

import {type GenericsMap, type GenericValue} from "../domain/Generics.js";
import {from} from "./from.js";

export function generic(type: Type<any> = Object) {
  function of(generics: GenericsMap): ReturnType<typeof from>;
  function of(generic: GenericValue): ReturnType<typeof from>;
  function of(...generics: Array<GenericValue[] | GenericValue>): ReturnType<typeof from>;
  function of(...generics: [GenericsMap] | Array<GenericValue[] | GenericValue>) {
    return from(type).genericOf(...generics);
  }

  return {
    of
  };
}
