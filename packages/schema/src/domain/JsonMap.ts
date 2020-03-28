import {isFunction} from "@tsed/core";
import {JsonSerializerOptions} from "../interfaces";
import {serializeMap} from "../utils/serializeJsonSchema";

export class JsonMap<T> extends Map<string, any> {
  [key: string]: any;

  constructor(obj: Partial<T> = {}) {
    super();

    this.assign(obj);
  }

  assign(obj: Partial<T> & any = {}) {
    Object.entries(obj).forEach(([key, value]) => {
      if (isFunction(this[key])) {
        this[key](value);
      } else {
        this.set(key, value);
      }
    });

    return this;
  }

  toJSON(options: JsonSerializerOptions = {}) {
    return serializeMap(this, options);
  }
}
