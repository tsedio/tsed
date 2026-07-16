import {JsonMap} from "../domain/JsonMap.js";
import type {Type} from "@tsed/core";

/**
 * @ignore
 */
export function toJsonMapCollection(content: {[key: string]: any}, klass: Type<JsonMap<any>> = JsonMap) {
  return Object.entries(content).reduce((content, [key, value]) => {
    content.set(key, new klass(value));

    return content;
  }, new JsonMap<any>());
}
