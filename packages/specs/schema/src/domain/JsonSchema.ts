import {ancestorsOf, classOf, isArray, isClass, isFunction, isObject, isPrimitiveClass, nameOf, Type, uniq, ValueOf} from "@tsed/core";
import {Hooks} from "@tsed/hooks";
import type {JSONSchema6, JSONSchema6Definition, JSONSchema6Type, JSONSchema6TypeName, JSONSchema6Version} from "json-schema";

import {IgnoreCallback} from "../interfaces/IgnoreCallback.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {enumsRegistry} from "../registries/enumRegistries.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {NestedGenerics} from "../utils/generics.js";
import {getComputedType} from "../utils/getComputedType.js";
import {getJsonType} from "../utils/getJsonType.js";
import {serializeEnumValues} from "../utils/serializeEnumValues.js";
import {toJsonRegex} from "../utils/toJsonRegex.js";
import {AliasMap, AliasType} from "./JsonAliasMap.js";
import {Discriminator} from "./JsonDiscriminator.js";
import {JsonEntityStore} from "./JsonEntityStore.js";
import {JsonFormatTypes} from "./JsonFormatTypes.js";
import {JsonLazyRef} from "./JsonLazyRef.js";

export interface JsonSchemaObject extends JSONSchema6, Record<string, any> {
  type: (any | JSONSchema6TypeName) | (any | JSONSchema6TypeName)[];
  additionalProperties?: boolean | JSONSchema6 | any;
  propertyNames?: boolean | JSONSchema6 | any;
  items?: (any | JSONSchema6Definition) | (any | JSONSchema6Definition)[];
}

export type AnyJsonSchema = Partial<JsonSchemaObject> | JsonSchema | JsonLazyRef | any;

function mapProperties(properties: Record<string, any>) {
  // istanbul ignore next
  if (properties instanceof JsonSchema) {
    return properties;
  }

  return Object.entries(properties).reduce<any>((properties, [key, schema]) => {
    properties[toJsonRegex(key)] = mapToJsonSchema(schema);

    return properties;
  }, {});
}

function mapToJsonSchema(item: any): any {
  if (isArray(item)) {
    return (item as any[]).map(mapToJsonSchema);
  }

  if (item.isStore || item.$isJsonDocument || item.isLazyRef) {
    return item;
  }

  if (classOf(item) !== Object && isClass(item)) {
    return JsonEntityStore.from(item).schema;
  }

  if (isObject(item)) {
    return JsonSchema.from(item as any);
  }

  if (isPrimitiveClass(item)) {
    return JsonSchema.from({type: item});
  }

  return item;
}

export class JsonSchema extends Map<string, any> implements NestedGenerics {
  readonly $kind: string = "schema";
  readonly $isJsonDocument = true;
  readonly $hooks = new Hooks();
  readonly $required: Set<string> = new Set();
  readonly $allow: any[] = [];
  public $selfRequired: boolean;
  public $forwardGroups: boolean = false;
  public $ignore: boolean | IgnoreCallback = false;

  public isDiscriminatorKey = false;
  public isDiscriminator = false;

  #nullable: boolean = false;
  #discriminator: null | Discriminator = null;
  #genericLabels: string[];
  #nestedGenerics: Type<any>[][] = [];
  #alias: AliasMap = new Map();
  #itemSchema: JsonSchema;
  #target: Type<any>;
  #isGeneric: boolean = false;
  #isCollection: boolean = false;
  #ref: boolean = false;

  constructor(obj: JsonSchema | Partial<JsonSchemaObject> = {}) {
    super();

    if (obj) {
      this.assign(obj);
    }
  }

  get alias() {
    return this.#alias;
  }

  get nestedGenerics(): any[] {
    return this.#nestedGenerics;
  }

  set nestedGenerics(value: any[]) {
    this.#nestedGenerics = value;
  }

  get genericLabels(): string[] {
    return this.#genericLabels;
  }

  set genericLabels(value: string[]) {
    this.#genericLabels = value;
  }

  get isClass() {
    return isClass(this.class) && ![Map, Array, Set, Object, Date, Boolean, Number, String].includes(this.#target as any);
  }

  /**
   * Current schema is a collection
   */
  get isCollection() {
    return this.#isCollection;
  }

  /**
   * Current schema is a generic
   */
  get isGeneric() {
    return this.#isGeneric;
  }

  get discriminatorAncestor() {
    const ancestors = ancestorsOf(this.#target);
    const ancestor = ancestors.find((ancestor) => JsonEntityStore.from(ancestor).schema.isDiscriminator);
    return ancestor && JsonEntityStore.from(ancestor).schema;
  }

  /**
   * Current schema has generics items
   */
  get hasGenerics(): boolean {
    return !!(this.nestedGenerics && this.nestedGenerics.length);
  }

  get genericType(): string {
    return this.get("$ref");
  }

  get class() {
    return this.getComputedType();
  }

  get canRef(): boolean {
    return this.#ref;
  }

  get isNullable(): boolean {
    return this.#nullable;
  }

  get isReadOnly() {
    return this.get("readOnly");
  }

  get isWriteOnly() {
    return this.get("writeOnly");
  }

  get hasDiscriminator() {
    return !!this.#discriminator;
  }

  static from(obj: Partial<JsonSchemaObject> = {}) {
    return new JsonSchema(obj);
  }

  nullable(value: boolean) {
    this.#nullable = value;
  }

  itemSchema(obj: AnyJsonSchema = {}) {
    this.#itemSchema = this.#itemSchema || mapToJsonSchema(obj);
    this.#itemSchema.assign(obj);

    return this.#itemSchema;
  }

  getAliasOf(property: AliasType) {
    return this.#alias.get(property as any);
  }

  addAlias(property: AliasType, alias: AliasType) {
    this.#alias.set(property, alias);
    this.#alias.set(alias, property);

    return this;
  }

  removeAlias(property: AliasType) {
    const alias = this.#alias.get(property);
    alias && this.#alias.delete(alias);
    this.#alias.delete(property);

    return this;
  }

  $id($id: string) {
    super.set("$id", $id);

    return this;
  }

  $ref($ref: string) {
    super.set("$ref", $ref);

    return this;
  }

  $schema($schema: JSONSchema6Version) {
    super.set("$schema", $schema);

    return this;
  }

  /**
   * Create a ref and use name to sharing schema
   * @param name
   */
  label(name: string) {
    this.#ref = true;

    super.set("name", name);

    return this;
  }

  name(name: string) {
    super.set("name", name);

    return this;
  }

  ignore(cb: boolean | IgnoreCallback) {
    if (typeof cb !== "boolean") {
      this.$hooks.on("ignore", cb);
    }

    this.$ignore = cb;

    return this;
  }

  /**
   * This keyword can be used to supply a default JSON value associated with a particular schema.
   * It is RECOMMENDED that a default value be valid against the associated schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.3
   */
  default(value: JSONSchema6Type) {
    super.set("default", value);

    return this;
  }

  /**
   * More readible form of a one-element "enum"
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.24
   */
  const(value: JSONSchema6Type) {
    super.set("const", value);

    return this;
  }

  /**
   * This attribute is a string that provides a full description of the of purpose the instance property.
   *
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.2
   */
  description(description: string) {
    super.set("description", description);

    return this;
  }

  discriminator() {
    this.isDiscriminator = true;
    return (this.#discriminator =
      this.#discriminator ||
      new Discriminator({
        base: this.#target
      }));
  }

  discriminatorKey(propertyName: string) {
    this.discriminator().propertyName = propertyName;
    this.isDiscriminator = true;

    return this;
  }

  discriminatorValue(...values: string[]) {
    const discriminator = this.discriminatorAncestor.discriminator();
    discriminator.add(this.#target, values);

    this.isDiscriminator = true;

    const properties = this.get("properties");
    const schema: JsonSchema =
      properties[discriminator.propertyName] ||
      new JsonSchema({
        type: "string"
      });

    if (values.length === 1) {
      schema.const(values[0]);
      schema.examples([values[0]]);
    } else {
      schema.enum(...values);
      schema.examples(values);
    }

    properties[discriminator.propertyName] = schema;

    this.set("properties", properties);

    return this;
  }

  /**
   * This keyword determines how child instances validate for arrays, and does not directly validate the immediate instance itself.
   * If "items" is an array of schemas, validation succeeds if every instance element
   * at a position greater than the size of "items" validates against "additionalItems".
   * Otherwise, "additionalItems" MUST be ignored, as the "items" schema
   * (possibly the default value of an empty schema) is applied to all elements.
   * Omitting this keyword has the same behavior as an empty schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.10
   */
  additionalItems(additionalItems: boolean | AnyJsonSchema) {
    super.set("additionalItems", mapToJsonSchema(additionalItems));

    return this;
  }

  /**
   * An array instance is valid against "contains" if at least one of its elements is valid against the given schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.14
   */
  contains(contains: JSONSchema6Definition) {
    super.set("contains", mapToJsonSchema(contains));

    return this;
  }

  /**
   * Array of examples with no validation effect the value of "default" is usable as an example without repeating it under this keyword
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.4
   */
  examples(examples: JSONSchema6Type[]) {
    super.set("examples", examples);

    return this;
  }

  /**
   * Array of examples with no validation effect the value of "default" is usable as an example without repeating it under this keyword
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.4
   */
  example(...examples: JSONSchema6Type[]) {
    return this.examples(examples);
  }

  /**
   * This keyword determines how child instances validate for arrays, and does not directly validate the immediate instance itself.
   * Omitting this keyword has the same behavior as an empty schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.9
   */
  items(items: AnyJsonSchema | AnyJsonSchema[]) {
    super.set("items", (this.#itemSchema = mapToJsonSchema(items)));

    return this;
  }

  /**
   * Must be a non-negative integer.
   * An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.11
   */
  maxItems(maxItems: number) {
    super.set("maxItems", maxItems);

    return this;
  }

  /**
   * Must be a non-negative integer.
   * An array instance is valid against "maxItems" if its size is greater than, or equal to, the value of this keyword.
   * Omitting this keyword has the same behavior as a value of 0.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.12
   */
  minItems(minItems: number) {
    super.set("minItems", minItems);

    return this;
  }

  /**
   * If this keyword has boolean value false, the instance validates successfully.
   * If it has boolean value true, the instance validates successfully if all of its elements are unique.
   * Omitting this keyword has the same behavior as a value of false.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.13
   */
  uniqueItems(uniqueItems: boolean) {
    super.set("uniqueItems", uniqueItems);

    return this;
  }

  /**
   * Must be a non-negative integer.
   * An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.15
   */
  maxProperties(maxProperties: number) {
    super.set("maxProperties", maxProperties);

    return this;
  }

  /**
   * Must be a non-negative integer.
   * An object instance is valid against "maxProperties" if its number of properties is greater than,
   * or equal to, the value of this keyword.
   * Omitting this keyword has the same behavior as a value of 0.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.16
   */
  minProperties(minProperties: number) {
    super.set("minProperties", minProperties);

    return this;
  }

  allow(...allow: any[]) {
    if (([] as string[]).concat(this.getJsonType()).includes("string") && !this.has("minLength")) {
      this.minLength(1);
    }

    allow.forEach((value) => {
      switch (value) {
        case "":
          this.set("minLength", undefined);
          break;
        case null:
          this.any(
            ...["null"].concat(
              this.getJsonType(),
              this.$allow.map((v) => typeof v)
            )
          );
          break;
      }
    });

    this.$allow.push(...allow);

    return this;
  }

  /**
   * Elements of this array must be unique.
   * An object instance is valid against this keyword if every item in the array is the name of a property in the instance.
   * Omitting this keyword has the same behavior as an empty array.
   *
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.17
   */
  required(required: boolean | string[] = true) {
    if (isArray(required)) {
      this.$required.clear();

      required.forEach((value: any) => this.$required.add(value));
    } else {
      const schema = this.clone();
      schema.$selfRequired = required;

      if (([] as string[]).concat(schema.getJsonType()).includes("string")) {
        schema.minLength(1);
      }

      return schema;
    }

    return this;
  }

  addRequired(property: string) {
    this.$required.add(property);

    return this;
  }

  removeRequired(property: string) {
    this.$required.delete(property);

    return this;
  }

  isRequired(property: string): boolean {
    return this.$required.has(property);
  }

  /**
   * This keyword determines how child instances validate for objects, and does not directly validate the immediate instance itself.
   * Validation succeeds if, for each name that appears in both the instance and as a name within this keyword's value,
   * the child instance for that name successfully validates against the corresponding schema.
   * Omitting this keyword has the same behavior as an empty object.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.18
   */
  properties(properties: AnyJsonSchema | Record<string, AnyJsonSchema>) {
    super.set("properties", mapProperties(properties));

    return this;
  }

  addProperty(key: string, schema: AnyJsonSchema) {
    const properties = this.get("properties") || {};

    properties[key] = schema;

    super.set("properties", mapProperties(properties));

    return this;
  }

  /**
   * This attribute is an object that defines the schema for a set of property names of an object instance.
   * The name of each property of this attribute's object is a regular expression pattern in the ECMA 262, while the value is a schema.
   * If the pattern matches the name of a property on the instance object, the value of the instance's property
   * MUST be valid against the pattern name's schema value.
   * Omitting this keyword has the same behavior as an empty object.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.19
   */
  patternProperties(patternProperties: Record<string, AnyJsonSchema>) {
    super.set("patternProperties", mapProperties(patternProperties));

    return this;
  }

  /**
   * This attribute defines a schema for all properties that are not explicitly defined in an object type definition.
   * If specified, the value MUST be a schema or a boolean.
   * If false is provided, no additional properties are allowed beyond the properties defined in the schema.
   * The default value is an empty schema which allows any value for additional properties.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.20
   */
  additionalProperties(additionalProperties: boolean | AnyJsonSchema) {
    super.set("additionalProperties", mapToJsonSchema(additionalProperties));

    return this;
  }

  /**
   * This attribute defines a schema for all properties that are not explicitly defined in an object type definition.
   * If specified, the value MUST be a schema or a boolean.
   * If false is provided, no additional properties are allowed beyond the properties defined in the schema.
   * The default value is an empty schema which allows any value for additional properties.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.20
   * @alias additionalProperties
   * @param unknown
   */
  unknown(unknown: boolean = true) {
    return this.additionalProperties(unknown);
  }

  /**
   * This keyword specifies rules that are evaluated if the instance is an object and contains a certain property.
   * Each property specifies a dependency.
   * If the dependency value is an array, each element in the array must be unique.
   * Omitting this keyword has the same behavior as an empty object.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.21
   */
  dependencies(dependencies: {[p: string]: JSONSchema6Definition | JsonSchema | string[]}) {
    super.set("dependencies", mapProperties(dependencies));

    return this;
  }

  /**
   * Takes a schema which validates the names of all properties rather than their values.
   * Note the property name that the schema is testing will always be a string.
   * Omitting this keyword has the same behavior as an empty schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.22
   */
  propertyNames(propertyNames: JSONSchema6Definition | JsonSchema) {
    super.set("propertyNames", mapToJsonSchema(propertyNames));

    return this;
  }

  /**
   * This provides an enumeration of all possible values that are valid
   * for the instance property. This MUST be an array, and each item in
   * the array represents a possible value for the instance value. If
   * this attribute is defined, the instance value MUST be one of the
   * values in the array in order for the schema to be valid.
   *
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.23
   */
  enum(...enumValues: any[]): this;
  enum(enumSchema: JsonSchema): this;
  enum(enumValue: any | any[] | JsonSchema, ...enumValues: any[]): this {
    if (enumsRegistry.has(enumValue)) {
      return this.enum(enumsRegistry.get(enumValue));
    }

    if (enumValue instanceof JsonSchema) {
      if (enumValue.getName()) {
        super.set("enum", enumValue);
      } else {
        super.set("enum", enumValue.get("enum")).any(...enumValue.get("enum").map((value: any) => typeof value));
      }
    } else {
      const {values, types} = serializeEnumValues([enumValue, enumValues].flat());

      super.set("enum", values).any(...types);
    }

    return this;
  }

  /**
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.1
   */
  definitions(definitions: Record<string, AnyJsonSchema>) {
    super.set("definitions", mapProperties(definitions));

    return this;
  }

  /**
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
   */
  allOf(allOf: AnyJsonSchema[]) {
    this.setManyOf("allOf", allOf);

    return this;
  }

  /**
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
   */
  anyOf(anyOf: AnyJsonSchema[]) {
    this.setManyOf("anyOf", anyOf);

    return this;
  }

  /*
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
   */
  oneOf(oneOf: AnyJsonSchema[]) {
    this.setManyOf("oneOf", oneOf);

    return this;
  }

  /**
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.29
   */
  not(not: AnyJsonSchema) {
    super.set("not", mapToJsonSchema(not));

    return this;
  }

  /**
   * Must be strictly greater than 0.
   * A numeric instance is valid only if division by this keyword's value results in an integer.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.1
   */
  multipleOf(multipleOf: number): this {
    super.set("multipleOf", multipleOf);

    return this;
  }

  /**
   * Representing an inclusive upper limit for a numeric instance.
   * This keyword validates only if the instance is less than or exactly equal to "maximum".
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.2
   */
  maximum(maximum: number): this {
    super.set("maximum", maximum);

    return this;
  }

  /**
   * Representing an exclusive upper limit for a numeric instance.
   * This keyword validates only if the instance is strictly less than (not equal to) to "exclusiveMaximum".
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.3
   */
  exclusiveMaximum(exclusiveMaximum: number): this {
    super.set("exclusiveMaximum", exclusiveMaximum);

    return this;
  }

  /**
   * Representing an inclusive lower limit for a numeric instance.
   * This keyword validates only if the instance is greater than or exactly equal to "minimum".
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.4
   */
  minimum(minimum: number): this {
    super.set("minimum", minimum);

    return this;
  }

  /**
   * Representing an exclusive lower limit for a numeric instance.
   * This keyword validates only if the instance is strictly greater than (not equal to) to "exclusiveMinimum".
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.5
   */
  exclusiveMinimum(exclusiveMinimum: number): this {
    super.set("exclusiveMinimum", exclusiveMinimum);

    return this;
  }

  /**
   * Must be a non-negative integer.
   * A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.6
   */
  maxLength(maxLength: number): this {
    super.set("maxLength", maxLength);

    return this;
  }

  /**
   * Must be a non-negative integer.
   * A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.
   * Omitting this keyword has the same behavior as a value of 0.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.7
   */
  minLength(minLength: number): this {
    super.set("minLength", minLength);

    return this;
  }

  /**
   * Should be a valid regular expression, according to the ECMA 262 regular expression dialect.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.8
   */
  pattern(pattern: string | RegExp): this {
    super.set("pattern", toJsonRegex(pattern));

    return this;
  }

  /**
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-8
   */
  format(format: JsonFormatTypes | ValueOf<JsonFormatTypes>): this {
    super.set("format", format);

    return this;
  }

  /**
   * A single type, or a union of simple types
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.25
   */
  type(type: any | JSONSchema6TypeName | JSONSchema6TypeName[]): this {
    switch (type) {
      case "map":
      case Map:
        super.set("type", getJsonType(type));
        this.#target = type;
        this.#isCollection = true;
        if (!this.has("additionalProperties")) {
          super.set("additionalProperties", this.itemSchema({}));
        }
        break;

      case "array":
      case Array:
        super.set("type", getJsonType(type));
        this.#target = type;
        this.#isCollection = true;

        if (!this.has("items")) {
          super.set("items", this.itemSchema({}));
        }
        break;

      case "set":
      case Set:
        super.set("type", getJsonType(type));
        this.#target = type;
        this.#isCollection = true;
        this.uniqueItems(true);

        if (!this.has("items")) {
          super.set("items", this.itemSchema({}));
        }
        break;

      case "integer":
        this.integer();
        break;

      case "number":
      case "string":
      case "boolean":
      case "object":
      case Object:
      case Date:
      case Boolean:
      case Number:
      case String:
        super.set("type", getJsonType(type));
        this.#target = type;
        if (!this.has("properties")) {
          super.set("properties", {});
        }
        break;

      default:
        if (isClass(type) || isFunction(type)) {
          super.set("type", undefined);
          this.#target = type;

          if (!this.has("properties")) {
            super.set("properties", {});
          }
        } else {
          const jsonType = getJsonType(type);
          if (jsonType === "generic") {
            this.#isGeneric = true;
            super.set("$ref", type);
          } else {
            super.set("type", jsonType);
          }
        }
    }

    return this;
  }

  any(...types: any[]) {
    types = types.length ? types : ["integer", "number", "string", "boolean", "array", "object", "null"];

    types = uniq(types).map((o) => {
      return isClass(o) ? o : {type: getJsonType(o)};
    });

    if (types.length > 1) {
      this.anyOf(types);
    } else {
      this.type(types[0]?.type || types[0]);
    }

    return this;
  }

  integer() {
    super.set("type", "integer");
    super.set("multipleOf", 1.0);

    return this;
  }

  /**
   * This attribute is a string that provides a short description of the instance property.
   *
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.2
   */
  title(title: string): this {
    super.set("title", title);

    return this;
  }

  readOnly(readOnly: boolean): this {
    super.set("readOnly", readOnly);

    return this;
  }

  writeOnly(readOnly: boolean): this {
    super.set("writeOnly", readOnly);

    return this;
  }

  customKey(key: string, value: any) {
    super.set(`#${key}`, value);

    return this;
  }

  toObject(options?: JsonSchemaOptions) {
    return this.toJSON(options);
  }

  toJSON(options?: JsonSchemaOptions) {
    return execMapper("schema", [this], options);
  }

  assign(obj: JsonSchema | Partial<JsonSchemaObject> = {}) {
    const entries = obj instanceof JsonSchema ? [...obj.entries()] : Object.entries(obj);
    entries.forEach(([key, value]) => {
      this.set(key, value);
    });

    if (obj instanceof JsonSchema) {
      this.$selfRequired = obj.$selfRequired;
      this.$allow.push(...obj.$allow);

      obj.$required.forEach((key) => {
        this.$required.add(key);
      });

      this.#discriminator = this.#discriminator ? new Discriminator(this.#discriminator) : null;
      this.isDiscriminator = obj.isDiscriminator;
      this.isDiscriminatorKey = obj.isDiscriminatorKey;
      this.#ref = obj.#ref;

      this.#alias = new Map(this.#alias.entries());
      obj.#genericLabels && (this.#genericLabels = [...obj.#genericLabels]);
      this.#nestedGenerics = obj.#nestedGenerics.map((item) => [...item]);
      this.#target = obj.#target;
      this.#isGeneric = obj.#isGeneric;
      this.#isCollection = obj.#isCollection;
      this.#ref = obj.#ref;
      this.#nullable = obj.#nullable;

      super.set("type", obj.get("type"));
    }

    return this;
  }

  set(key: string, value: any): this {
    if (key in this) {
      isFunction((this as any)[key]) && (this as any)[key](value);
    } else {
      super.set(key, value);
    }

    return this;
  }

  /**
   * Return the itemSchema computed type.
   * If the type is a function used for recursive model,
   * the function will be called to get the right type.
   */
  getComputedType(): any {
    return getComputedType(this.#target);
  }

  getComputedItemType(): any {
    return this.#itemSchema ? this.#itemSchema.getComputedType() : this.getComputedType();
  }

  /**
   * Return the Json type as string
   */
  getJsonType(): string | string[] {
    if (this.get("anyOf")) {
      return this.get("anyOf").map((o: JsonSchema) => {
        return o.getJsonType();
      });
    }

    return this.get("type") || getJsonType(this.getComputedType());
  }

  getTarget() {
    return this.#target;
  }

  /**
   * Get the symbolic name of the entity
   */
  getName() {
    return this.get("name") || (isClass(this.#target) ? nameOf(classOf(this.getComputedType())) : "");
  }

  clone() {
    return new JsonSchema(this);
  }

  protected setManyOf(keyword: "oneOf" | "anyOf" | "allOf", value: AnyJsonSchema[]) {
    let resolved = value
      .filter((o) => {
        if (o?.type === "null") {
          this.nullable(true);
          return false;
        }
        return true;
      })
      .map(mapToJsonSchema);

    if (resolved.length === 1 && !(value[0] instanceof JsonSchema) && !this.isNullable) {
      if (!resolved[0].hasDiscriminator) {
        return this.type(value[0]);
      }

      const children = resolved[0].discriminator().children();

      if (!children.length) {
        return this.type(value[0]);
      }

      resolved = children.map(mapToJsonSchema);
    }

    super.set(keyword, resolved);

    const jsonSchema: JsonSchema = resolved[0];

    if (jsonSchema.isDiscriminator) {
      const discriminator = jsonSchema.discriminatorAncestor.discriminator();
      const {propertyName} = discriminator;

      super.set("discriminator", {
        propertyName,
        mapping: resolved.reduce((acc, schema: JsonSchema) => {
          discriminator.types.get(schema.getTarget())?.forEach((key: string) => {
            acc[key] = schema;
          });

          return acc;
        }, {})
      });

      this.isDiscriminator = true;
      this.#discriminator = discriminator;
    }
  }
}
