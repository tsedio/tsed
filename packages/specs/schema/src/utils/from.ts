import {isClass, Type} from "@tsed/core";

import {JsonEntityStore} from "../domain/JsonEntityStore.js";
import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import {JsonLazyRef} from "../domain/JsonLazyRef.js";
import {JsonSchema} from "../domain/JsonSchema.js";
import {enumsRegistry} from "../registries/enumRegistries.js";
import {getJsonEntityStore} from "./getJsonEntityStore.js";

/**
 * Create a new model from the given type.
 *
 * ```typescript
 * from(String)
 * ```
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function from(type: Type<any> = Object) {
  if (isClass(type)) {
    const {schema} = getJsonEntityStore(type);

    schema.properties = function properties(obj: {[key: string]: JsonSchema}) {
      Object.entries(obj).forEach(([propertyKey, propSchema]) => {
        getJsonEntityStore(type.prototype, propertyKey).schema.assign(propSchema);
      });

      return this;
    };

    return schema;
  }

  return JsonSchema.from({type});
}

/**
 * Declare a new number model.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function number() {
  return from(Number);
}

/**
 * Declare a new integer model.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function integer() {
  return from(Number).integer();
}

/**
 * Declare a new string model.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function string() {
  return from(String);
}

/**
 * Declare a new boolean model.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function boolean() {
  return from(Boolean);
}

/**
 * Declare a new string model with `format: date`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function date() {
  return from(Date).format(JsonFormatTypes.DATE);
}

/**
 * Declare a new string model with `format: datetime`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function datetime() {
  return from(Date).format(JsonFormatTypes.DATE_TIME);
}

/**
 * Declare a new string model with `format: time`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function time() {
  return from(Date).format(JsonFormatTypes.TIME);
}

/**
 * Declare a new string model with `format: email`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function email() {
  return from(String).format(JsonFormatTypes.EMAIL);
}

/**
 * Declare a new string model with `format: uri`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function uri() {
  return from(String).format(JsonFormatTypes.URI);
}

/**
 * Declare a new string model with `format: url`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function url() {
  return from(String).format(JsonFormatTypes.URL);
}

/**
 * Declare a new object model with `additionalProperties: true`.
 *
 * ```json
 * {
 *   "type": "array"
 * }
 * ```
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function array() {
  return from(Array);
}

/**
 * Declare a new object model with `additionalProperties: true`.
 *
 * ```json
 * {
 *   "type": "object",
 *   "additionalProperties": true
 * }
 * ```
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function map() {
  return from(Map).unknown(true);
}

/**
 * Declare a new array model with `uniqueItems: true`.
 *
 * ```json
 * {
 *   "type": "array",
 *   "uniqueItems": true
 * }
 * ```
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function set() {
  return from(Array).uniqueItems(true);
}

/**
 * Declare a new object model.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function object(properties: {[key: string]: JsonSchema} = {}) {
  return from(Object).properties(properties);
}

/**
 * Declare a model with any type (By default: `integer`, `number`, `string`, `boolean`, `array`, `object`, `null`)
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function any(...types: any[]) {
  return from().any(...types);
}

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 * @schemaFunctional
 */
export function anyOf(...anyOf: any[]) {
  return from().anyOf(anyOf);
}

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 */
export function oneOf(...oneOf: any[]) {
  return from().oneOf(oneOf);
}

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 * @schemaFunctional
 */
export function allOf(...allOf: any[]) {
  return from().allOf(allOf);
}

/**
 * Declare a sub schema which will be resolved later. Use this function when you have a circular reference between two schemes.
 *
 * @schemaFunctional
 */
export function lazyRef(cb: () => Type<any>) {
  try {
    // solve issue with a self referenced model
    if (cb()) {
      // type is already accessible
      return JsonEntityStore.from(cb()).schema as any;
    }
  } catch (er) {}

  return new JsonLazyRef(cb);
}
export function enums(e: Record<string, any>) {
  const schema = string().enum(e);
  enumsRegistry.set(e, schema);

  return schema;
}
