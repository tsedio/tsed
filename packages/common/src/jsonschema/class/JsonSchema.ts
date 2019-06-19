import {
  deepExtends,
  descriptorOf,
  Enumerable,
  isArrayOrArrayClass,
  isDate,
  isPrimitiveOrPrimitiveClass,
  nameOf,
  NotEnumerable,
  primitiveOf
} from "@tsed/core";
import {JSONSchema6, JSONSchema6Type, JSONSchema6TypeName} from "json-schema";

/**
 *
 * @type {string[]}
 */
export const JSON_TYPES = ["string", "number", "integer", "boolean", "object", "array", "null", "any"];
/**
 *
 * @type {string[]}
 */
export const AUTO_MAP_KEYS: string[] = [];

/**
 * Internal use only.
 * @returns {Function}
 * @decorator
 * @private
 * @param target
 * @param propertyKey
 */
function AutoMapKey(target: any, propertyKey: string): any {
  AUTO_MAP_KEYS.push(propertyKey);

  const descriptor = descriptorOf(target, propertyKey) || {configurable: true, writable: true};
  descriptor.enumerable = true;

  return descriptor;
}

export class JsonSchema implements JSONSchema6 {
  /**
   *
   * @type {string}
   */
  @Enumerable()
  $id: string;
  @Enumerable()
  id: string;
  @AutoMapKey
  $ref: string;
  @Enumerable()
  $schema: any;
  @Enumerable()
  title: string;
  @Enumerable()
  description: string;
  @Enumerable()
  default: JSONSchema6Type;
  @Enumerable()
  additionalItems: boolean | JSONSchema6;
  @Enumerable()
  items: JsonSchema;
  @Enumerable()
  maxItems: number;
  @Enumerable()
  minItems: number;
  @Enumerable()
  uniqueItems: boolean;
  @Enumerable()
  maxProperties: number;
  @Enumerable()
  minProperties: number;
  @Enumerable()
  required: any | string[];
  @Enumerable()
  properties: {[key: string]: JsonSchema};
  @Enumerable()
  additionalProperties: JsonSchema;
  @Enumerable()
  definitions: {[p: string]: JSONSchema6};
  @Enumerable()
  patternProperties: {[p: string]: JSONSchema6};
  @Enumerable()
  dependencies: {[p: string]: JSONSchema6 | string[]};
  @Enumerable()
  allOf: JSONSchema6[];
  @Enumerable()
  anyOf: JSONSchema6[];
  @Enumerable()
  oneOf: JSONSchema6[];
  @Enumerable()
  not: JSONSchema6;
  @Enumerable()
  extends: string | string[];
  @AutoMapKey
  multipleOf: number;
  @AutoMapKey
  maximum: number;
  @AutoMapKey
  exclusiveMaximum: number;
  @AutoMapKey
  minimum: number;
  @AutoMapKey
  exclusiveMinimum: number;
  @AutoMapKey
  maxLength: number;
  @AutoMapKey
  minLength: number;
  @AutoMapKey
  pattern: string;
  @AutoMapKey
  format: string;
  @AutoMapKey
  enum: JSONSchema6Type[];

  @NotEnumerable()
  private _refName: string;
  @NotEnumerable()
  private _isCollection: boolean;
  @NotEnumerable()
  private _type: JSONSchema6TypeName | JSONSchema6TypeName[];
  private _proxy: any;

  [key: string]: any;

  constructor() {
    this._proxy = new Proxy<JsonSchema>(this, {
      set(schema: JsonSchema, propertyKey: any, value: any) {
        schema.mapValue(propertyKey, value);

        return true;
      }
    } as any);
  }

  /**
   *
   * @returns {JSONSchema6}
   */
  @NotEnumerable()
  get mapper(): JSONSchema6 {
    return this._proxy;
  }

  /**
   *
   * @returns {any | JSONSchema6TypeName | JSONSchema6TypeName[]}
   */
  get type(): any | JSONSchema6TypeName | JSONSchema6TypeName[] {
    return this._type;
  }

  /**
   *
   * @param {any | JSONSchema6TypeName | JSONSchema6TypeName[]} value
   */
  @Enumerable()
  set type(value: any | JSONSchema6TypeName | JSONSchema6TypeName[]) {
    if (value) {
      this._refName = nameOf(value);
      this._type = JsonSchema.getJsonType(value);
    } else {
      delete this._refName;
      delete this._type;
    }
  }

  /**
   *
   * @returns {string}
   */
  get refName() {
    return this._refName;
  }

  /**
   *
   * @returns {boolean}
   */
  get isCollection(): boolean {
    return this._isCollection;
  }

  /**
   *
   * @returns {boolean}
   */
  get isArray(): boolean {
    return this.type === "array";
  }

  /**
   *
   * @returns {"collection" | JSONSchema6TypeName | JSONSchema6TypeName[]}
   */
  get schemaType(): "collection" | JSONSchema6TypeName | JSONSchema6TypeName[] {
    if (this.isCollection) {
      if (!this.isArray) {
        return "collection";
      }
    }

    return this.type;
  }

  /**
   *
   * @param value
   * @returns {JSONSchema6TypeName | JSONSchema6TypeName[]}
   */
  static getJsonType(value: any): JSONSchema6TypeName | JSONSchema6TypeName[] {
    if (isPrimitiveOrPrimitiveClass(value)) {
      if (JSON_TYPES.indexOf(value as string) > -1) {
        return value;
      }

      return primitiveOf(value);
    }

    if (isArrayOrArrayClass(value)) {
      if (value !== Array) {
        return value;
      }

      return "array";
    }

    if (isDate(value)) {
      return "string";
    }

    return "object";
  }

  /**
   *
   * @param type
   * @returns {JSONSchema6}
   */
  static ref(type: any): JsonSchema {
    const schema = new JsonSchema();
    schema.$ref = `#/definitions/${nameOf(type)}`;

    return schema;
  }

  /**
   * Write value on the right place according to the schema type
   */
  mapValue(key: string, value: any) {
    switch (this.schemaType) {
      case "collection":
        this.additionalProperties[key] = value;
        break;
      case "array":
        this.items[key] = value;
        break;
      default:
        this[key] = value;
    }
  }

  /**
   *
   * @param collectionType
   */
  toCollection(collectionType: any) {
    this._isCollection = true;

    if (isArrayOrArrayClass(collectionType)) {
      this.items = this.items || new JsonSchema();
      this.items.type = this._type;
      this._type = "array";

      this.forwardKeysTo(this, "items");
    } else {
      this.additionalProperties = new JsonSchema();
      this.additionalProperties.type = this._type;
      delete this._type;

      this.forwardKeysTo(this, "additionalProperties");
    }
  }

  /**
   *
   * @returns {{}}
   */
  toJSON() {
    const obj: any = {};

    for (const key in this) {
      if (!key.match(/^_/) && typeof this[key] !== "function") {
        const value: any = this[key];

        if (value !== undefined) {
          if (value instanceof JsonSchema) {
            obj[key] = value.toJSON();
          } else {
            obj[key] = value;
          }
        }
      }
    }

    return obj;
  }

  toObject() {
    return JSON.parse(JSON.stringify(this.toJSON()));
  }

  /**
   *
   * @param obj
   */
  merge(obj: any): this {
    deepExtends(this, obj);

    return this;
  }

  /**
   *
   * @param instance
   * @param {string} property
   */
  private forwardKeysTo(instance: any, property: string) {
    AUTO_MAP_KEYS.forEach(key => {
      if (instance[key]) {
        instance[property][key] = instance[key];
        delete instance[key];
      }
    });
  }
}
