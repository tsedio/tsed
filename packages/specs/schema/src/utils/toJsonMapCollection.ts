import {JsonMap} from "../domain/JsonMap.js";

/**
 * @ignore
 */
export function toJsonMapCollection(content: {[key: string]: any}, klass = JsonMap) {
  return Object.entries(content).reduce((content, [key, value]) => {
    content.set(key, new klass(value));

    return content;
  }, new JsonMap<any>());
}
