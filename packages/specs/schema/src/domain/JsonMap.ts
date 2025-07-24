import {isFunction} from "@tsed/core";

import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";

export class JsonMap<T> extends Map<string, any> {
  [key: string]: any;

  $kind: string = "map";
  readonly $isJsonDocument = true;

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

  toJSON(options?: JsonSchemaOptions) {
    return execMapper("map", [this], options);
  }
}
