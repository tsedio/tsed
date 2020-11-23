import {isClass, Type} from "@tsed/core";
import {JsonEntityStore, JsonFormatTypes} from "../domain";
import {JsonSchema} from "../domain/JsonSchema";

export function from(type: Type<any> = Object) {
  if (isClass(type) && []) {
    const {schema} = JsonEntityStore.from(type);

    schema.properties = function properties(obj: {[key: string]: JsonSchema}) {
      Object.entries(obj).forEach(([propertyKey, propSchema]) => {
        JsonEntityStore.from(type.prototype, propertyKey).schema.assign(propSchema);
      });

      return this;
    };

    return schema;
  }

  return JsonSchema.from({type});
}

export function number() {
  return from(Number);
}

export function integer() {
  return from(Number).integer();
}

export function string() {
  return from(String);
}

export function boolean() {
  return from(Boolean);
}

export function date() {
  return from(Date).format(JsonFormatTypes.DATE);
}

export function datetime() {
  return from(Date).format(JsonFormatTypes.DATE_TIME);
}

export function time() {
  return from(Date).format(JsonFormatTypes.TIME);
}

export function email() {
  return from(String).format(JsonFormatTypes.EMAIL);
}

export function uri() {
  return from(String).format(JsonFormatTypes.URI);
}

export function url() {
  return from(String).format(JsonFormatTypes.URL);
}

export function array() {
  return from(Array);
}

export function map() {
  return from(Map).unknown(true);
}

export function set() {
  return from(Array).uniqueItems(true);
}

export function object(properties: {[key: string]: JsonSchema} = {}) {
  return from(Object).properties(properties);
}

export function any(...types: any[]) {
  return from().any(...types);
}

export function anyOf(...anyOf: any[]) {
  return from().anyOf(anyOf);
}

export function oneOf(...oneOf: any[]) {
  return from().oneOf(oneOf);
}

export function allOf(...allOf: any[]) {
  return from().allOf(allOf);
}
