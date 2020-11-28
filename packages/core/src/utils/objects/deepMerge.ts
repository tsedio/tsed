import {deepClone} from "./deepClone";
import {deepExtends} from "./deepExtends";

export function deepMerge(origin: any, source: any, inverse: boolean = false) {
  origin = deepClone(origin);
  source = deepClone(source);

  return inverse ? deepExtends(origin, source) : deepExtends(source, origin);
}
