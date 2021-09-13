import {isFunction} from "@tsed/core";
import {JsonSchemaOptions} from "../interfaces";
import {execMapper} from "../registries/JsonSchemaMapperContainer";

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

  toJSON(options: JsonSchemaOptions = {}) {
    return execMapper("map", this, options);
  }
}
