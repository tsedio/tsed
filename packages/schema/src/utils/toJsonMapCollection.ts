import {JsonMap} from "../domain/JsonMap";

export function toJsonMapCollection(content: {[key: string]: any}) {
  return Object.entries(content).reduce((content, [key, value]) => {
    content.set(key, new JsonMap(value));

    return content;
  }, new JsonMap<any>());
}
