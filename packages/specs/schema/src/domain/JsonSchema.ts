import {
  ancestorOf,
  ancestorsOf,
  classOf,
  isArray,
  isClass,
  isFunction,
  isObject,
  isPlainObject,
  isPrimitiveClass,
  nameOf,
  Type,
  uniq,
  ValueOf
} from "@tsed/core";
import {Hooks} from "@tsed/hooks";
import type {JSONSchema7, JSONSchema7Definition, JSONSchema7Type, JSONSchema7TypeName, JSONSchema7Version} from "json-schema";

import {VendorKeys} from "../constants/VendorKeys.js";
import {IgnoreCallback} from "../interfaces/IgnoreCallback.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {enumsRegistry} from "../registries/enumRegistries.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {type GenericsMap, GenericValue} from "../utils/generics.js";
import {getComputedType} from "../utils/getComputedType.js";
import {getJsonType} from "../utils/getJsonType.js";
import {matchGroups} from "../utils/matchGroups.js";
import {serializeEnumValues} from "../utils/serializeEnumValues.js";
import {toJsonRegex} from "../utils/toJsonRegex.js";
import {AliasMap, AliasType} from "./JsonAliasMap.js";
import {Discriminator} from "./JsonDiscriminator.js";
import {JsonEntityStore} from "./JsonEntityStore.js";
import {JsonFormatTypes} from "./JsonFormatTypes.js";
import {JsonLazyRef} from "./JsonLazyRef.js";
import type {Infer, PropsToShape, UnionToIntersection} from "./types.js";

export interface JsonSchemaObject extends Omit<JSONSchema7, "type" | "additionalProperties" | "items" | "pattern"> {
  type?: JSONSchema7["type"] | Type | null | (String | null | Date | Number | Object | Boolean)[];
  additionalProperties?: JsonSchemaObject | boolean | Type | JsonSchema;
  items?: JsonSchemaObject | boolean | Type | JsonSchema | (JsonSchemaObject | Type | JsonSchema)[];
  pattern?: string | RegExp;
}

export type AnyJsonSchema<T = any> =
  | JsonSchemaObject
  | JSONSchema7
  | JsonSchema<T>
  | JsonLazyRef
  | {
      label?: string;
    }
  | Type;

function isEnum(type: any) {
  return isObject(type) && !("toJSON" in type);
}

export class JsonSchema<T = JSONSchema7Type> extends Map<string, any> {
  readonly $kind: string = "schema";
  readonly $isJsonDocument = true;
  readonly $hooks = new Hooks();
  readonly $allow: any[] = [];
  public $selfRequired: boolean;
  public $ignore: boolean | IgnoreCallback = false;
  public isDiscriminatorKey = false;
  public isDiscriminator = false;
  /**
   * All required fields are stored here
   */
  #required: Set<string> = new Set();
  /**
   * Internal custom props
   * @private
   */
  #vendors = new Map<string, any>();
  #discriminator: null | Discriminator = null;
  #alias: AliasMap = new Map();
  #itemSchema: JsonSchema;
  /**
   * This flag is used to know if the schema is created to link property/param to a class schema.
   * @private
   */
  #isLocalSchema: boolean = false;
  #target: Type<any>;
  #isCollection: boolean = false;
  #useRefLabel: boolean = false;
  #propertyKey: string | symbol | undefined;

  constructor(obj?: Partial<JSONSchema7> | JsonSchema | Record<string, unknown>) {
    super();

    if (obj) {
      this.assign(obj);
    }
  }

  get alias() {
    return this.#alias;
  }

  get isClass() {
    return isClass(this.class) && !this.isCollection;
  }

  /**
   * The current schema is a collection
   */
  get isCollection() {
    return this.#isCollection;
  }

  /**
   * The current schema is a reference to another schema
   * to link property/param to a class schema (if the reference exists).
   */
  get isLocalSchema() {
    return this.#isLocalSchema;
  }

  /**
   * Current schema is a generic
   */
  get isGeneric() {
    return this.has(VendorKeys.GENERIC_LABEL);
  }

  get discriminatorAncestor() {
    const ancestors = ancestorsOf(this.#target);
    const ancestor = ancestors.find((ancestor) => JsonEntityStore.from(ancestor).schema.isDiscriminator);
    return ancestor && JsonEntityStore.from(ancestor).schema;
  }

  /**
   * Return the itemSchema computed type.
   * If the type is a function used for a recursive model,
   * the function will be called to get the right type.
   */
  get class() {
    if (this.#isLocalSchema) {
      return this.#itemSchema?.getTarget();
    }

    return getComputedType(this.#target);
  }

  /**
   * Return the itemSchema computed type.
   */
  get collectionClass() {
    return this.isCollection && this.#itemSchema ? this.#itemSchema.class : this.class;
  }

  get canRef(): boolean {
    return this.#useRefLabel;
  }

  get isNullable(): boolean {
    return !!this.get<Boolean>(VendorKeys.NULLABLE);
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

  static from(item: Partial<JsonSchemaObject> | Type<any> | JsonSchema | undefined) {
    if (item instanceof JsonSchema) {
      return item;
    }

    if (item && classOf(item) !== Object && isClass(item)) {
      return JsonEntityStore.from(item).schema;
    }

    if (isPrimitiveClass(item) || item === Date || item === null) {
      return new JsonSchema({type: item as Type});
    }

    return new JsonSchema(item as Partial<JsonSchemaObject>);
  }

  /**
   * Check if the schema as key, #key or x-key
   * @param key
   */
  has(key: string) {
    if (super.has(key)) {
      return true;
    }

    if (super.has(`#${key}`)) {
      return true;
    }

    return this.#vendors.has(key);
  }

  /**
   * Get the value of the schema by key, #key or x-key.
   * @param key
   * @param defaultValue
   */
  get<T = any>(key: string, defaultValue: T): T;

  get<T = any>(key: string, defaultValue?: T): T | undefined;

  get<T = any>(key: string, defaultValue?: T): T | undefined {
    if (this.#vendors.has(key)) {
      return this.#vendors.get(key);
    }

    if (super.has(key)) {
      return super.get(key);
    }

    if (super.has(`#${key}`)) {
      return super.get(`#${key}`);
    }

    return defaultValue;
  }

  forwardGroups(bool: boolean = true) {
    this.vendorKey(VendorKeys.FORWARD_GROUPS, bool);
    return this;
  }

  groups(groups?: string[], isProperty?: boolean) {
    if (groups) {
      this.vendorKey(VendorKeys.GROUPS, groups);
      // this.customKey("x-groups", groups);

      if (isProperty) {
        this.$hooks.on("groups", (prev: boolean, givenGroups: string[]) => {
          if (!prev) {
            if (matchGroups(groups, givenGroups)) {
              return true;
            }
          }

          return prev;
        });
      }
    }

    return this;
  }

  groupsName(groupsName?: string) {
    groupsName && this.vendorKey(VendorKeys.GROUPS_NAME, groupsName);
    return this;
  }

  allowedGroups(groups?: string[]) {
    groups && this.vendorKey(VendorKeys.ALLOWED_GROUPS, groups);
    return this;
  }

  /**
   * Assign the Generic Labels used over a class or a schema.
   * @param genericLabels
   */
  genericLabels(genericLabels: string[]) {
    this.vendorKey(VendorKeys.GENERIC_LABELS, genericLabels);
    return this;
  }

  genericLabel(genericLabel: string) {
    this.vendorKey(VendorKeys.GENERIC_LABEL, genericLabel);
    return this;
  }

  /**
   * Assign the types of the generics that must be used for the property
   * @param generics
   */
  genericOf(...generics: GenericValue[][]) {
    const mapped = this.mapGenerics(this.#itemSchema || this.mapToJsonSchema(this.getTarget()), generics);

    this.vendorKey(VendorKeys.GENERIC_OF, mapped);

    return this;
  }

  nullable(): JsonSchema<T | null>;
  nullable(value: true): JsonSchema<T | null>;
  nullable(value: false): JsonSchema<Exclude<T, null>>;
  nullable(value: boolean = true): JsonSchema<T | null> | JsonSchema<Exclude<T, null>> {
    if (!this.isNullable) {
      this.vendorKey(VendorKeys.NULLABLE, value);
    }

    return this;
  }

  itemSchema(obj: AnyJsonSchema = {}) {
    this.#itemSchema = this.#itemSchema || this.mapToJsonSchema(obj);

    if (isPlainObject(obj)) {
      this.#itemSchema.assign(obj as Record<string, unknown>);
    }

    if (!this.isCollection && this.#itemSchema?.isClass) {
      this.#isLocalSchema = true;
    }

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

  $schema($schema: JSONSchema7Version) {
    super.set("$schema", $schema);

    return this;
  }

  /**
   * Create a ref and use name to sharing schema
   * @param name
   */
  label(name: string) {
    this.#useRefLabel = true;

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
  default(value: T | undefined | (() => T)): JsonSchema<T> {
    super.set("default", value);

    return this;
  }

  /**
   * More readable form of a one-element "enum"
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.24
   */
  const<V extends T>(value: V): JsonSchema<V> {
    super.set("const", value);

    return this as JsonSchema<V>;
  }

  /**
   * This attribute is a string that provides a full description of the purpose of the instance property.
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

    const propertySchema = this.get("properties")[propertyName];
    if (propertySchema) {
      if (propertySchema.isCollection) {
        propertySchema.itemSchema().isDiscriminatorKey = true;
      } else {
        propertySchema.isDiscriminatorKey = true;
      }
    }

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
   * This keyword determines how child instances validate for arrays and does not directly validate the immediate instance itself.
   * If "items" is an array of schemas, validation succeeds if every instance element
   * at a position greater than the size of "items" validates against "additionalItems".
   * Otherwise, "additionalItems" MUST be ignored, as the "items" schema
   * (possibly the default value of an empty schema) is applied to all elements.
   * Omitting this keyword has the same behavior as an empty schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.10
   */
  additionalItems(additionalItems: boolean | AnyJsonSchema) {
    super.set("additionalItems", this.mapToJsonSchema(additionalItems));

    return this;
  }

  /**
   * An array instance is valid against "contains" if at least one of its elements is valid against the given schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.14
   */
  contains(contains: JSONSchema7Definition) {
    super.set("contains", this.mapToJsonSchema(contains));

    return this;
  }

  /**
   * Array of examples with no validation effect the value of "default" is usable as an example without repeating it under this keyword
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.4
   */
  examples(examples: JSONSchema7Type[]) {
    super.set("examples", examples);

    return this;
  }

  /**
   * Array of examples with no validation effect the value of "default" is usable as an example without repeating it under this keyword
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.4
   */
  example(...examples: JSONSchema7Type[]) {
    return this.examples(examples);
  }

  /**
   * This keyword determines how child instances validate for arrays and does not directly validate the immediate instance itself.
   * Omitting this keyword has the same behavior as an empty schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.9
   */
  /**
   * Set the items' schema for array/set collections
   * @param items The schema for array/set items
   */
  items<I = JSONSchema7Type>(
    items: JsonSchema<I> | AnyJsonSchema | AnyJsonSchema[]
  ): JsonSchema<T extends Array<any> ? I[] : T extends Set<any> ? Set<I> : I> {
    super.set("items", (this.#itemSchema = this.mapToJsonSchema(items) as unknown as JsonSchema));

    return this as JsonSchema<T extends Array<any> ? I[] : T extends Set<any> ? Set<I> : I>;
  }

  $comment(comment: string) {
    super.set("$comment", comment);
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
   * If this keyword has a boolean value false, the instance validates successfully.
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
          this.nullable(true);
          // this.any(
          //   ...["null"].concat(
          //     this.getJsonType(),
          //     this.$allow.map((v) => typeof v)
          //   )
          // );
          break;
      }
    });

    this.$allow.push(...allow);

    return this;
  }

  optional(): JsonSchema<T | undefined> {
    return this.required(false);
  }

  /**
   * Elements of this array must be unique.
   * An object instance is valid against this keyword if every item in the array is the name of a property in the instance.
   * Omitting this keyword has the same behavior as an empty array.
   *
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.17
   */
  required(): JsonSchema<Exclude<T, undefined>>;
  required(required: true): JsonSchema<Exclude<T, undefined>>;
  required(required: false): JsonSchema<T | undefined>;
  required(required: boolean | string[] = true): JsonSchema<Exclude<T, undefined>> | JsonSchema<T | undefined> {
    if (isArray(required)) {
      this.#required.clear();

      required.forEach((value: any) => this.#required.add(value));
    } else {
      const schema = this.clone();
      schema.$selfRequired = required;

      if (([] as string[]).concat(schema.getJsonType()).includes("string")) {
        schema.minLength(1);
      }

      return schema as unknown as JsonSchema<Exclude<T, undefined>> | JsonSchema<T | undefined>;
    }

    return this;
  }

  addRequired(property: string) {
    this.#required.add(property);

    return this;
  }

  removeRequired(property: string) {
    this.#required.delete(property);

    return this;
  }

  isRequired(property: string): boolean {
    return this.#required.has(property);
  }

  getRequiredFields(): string[] {
    return [...this.#required];
  }

  /**
   * This keyword determines how child instances validate for objects and does not directly validate the immediate instance itself.
   * Validation succeeds if, for each name that appears in both the instance and as a name within this keyword's value,
   * the child instance for that name successfully validates against the corresponding schema.
   * Omitting this keyword has the same behavior as an empty object.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.18
   */
  properties<P extends Record<string, JsonSchema<any>> = Record<string, JsonSchema<any>>>(properties: P): JsonSchema<PropsToShape<P>> {
    super.set("properties", this.mapProperties(properties));

    return this as JsonSchema<PropsToShape<P>>;
  }

  addProperty(key: string, schema: AnyJsonSchema) {
    const properties = this.get("properties") || {};

    properties[key] = schema;

    super.set("properties", this.mapProperties(properties));

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
  patternProperties<P extends Record<string, JsonSchema<any>> = Record<string, JsonSchema<any>>>(
    patternProperties: P
  ): JsonSchema<PropsToShape<P>> {
    super.set("patternProperties", this.mapProperties(patternProperties));

    return this as JsonSchema<PropsToShape<P>>;
  }

  /**
   * This attribute defines a schema for all properties that are not explicitly defined in an object type definition.
   * If specified, the value MUST be a schema or a boolean.
   * If false is provided, no additional properties are allowed beyond the properties defined in the schema.
   * The default value is an empty schema that allows any value for additional properties.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.20
   */
  additionalProperties<V>(additionalProperties: boolean | AnyJsonSchema | JsonSchema<V>): JsonSchema<Map<string, V>> {
    super.set("additionalProperties", this.mapToJsonSchema(additionalProperties));

    return this as JsonSchema<Map<string, V>>;
  }

  /**
   * This attribute defines a schema for all properties that are not explicitly defined in an object type definition.
   * If specified, the value MUST be a schema or a boolean.
   * If false is provided, no additional properties are allowed beyond the properties defined in the schema.
   * The default value is an empty schema that allows any value for additional properties.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.20
   * @alias additionalProperties
   * @param unknown
   */
  unknown(unknown: boolean = true): JsonSchema<T & Record<string, unknown>> {
    return this.additionalProperties(unknown) as unknown as JsonSchema<T & Record<string, unknown>>;
  }

  /**
   * This keyword specifies rules that are evaluated if the instance is an object and contains a certain property.
   * Each property specifies a dependency.
   * If the dependency value is an array, each element in the array must be unique.
   * Omitting this keyword has the same behavior as an empty object.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.21
   */
  dependencies(dependencies: {[p: string]: JSONSchema7Definition | JsonSchema | string[]}) {
    super.set("dependencies", this.mapProperties(dependencies));

    return this;
  }

  /**
   * Takes a schema which validates the names of all properties rather than their values.
   * Note the property name that the schema is testing will always be a string.
   * Omitting this keyword has the same behavior as an empty schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.22
   */
  propertyNames(propertyNames: JSONSchema7Definition | JsonSchema) {
    super.set("propertyNames", this.mapToJsonSchema(propertyNames));

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
  // enum(...enumValues: any[]): this;
  enum<E extends Record<string, string | number>>(e: E): JsonSchema<E[keyof E]>;
  enum<E extends readonly T[]>(...e: E): JsonSchema<E[number]>;
  enum<E extends readonly T[]>(e: E): JsonSchema<E[number]>;
  enum(enumValue: any, ...enumValues: any[]): this {
    if (enumsRegistry.has(enumValue)) {
      return this.enum(enumsRegistry.get(enumValue) as any) as this;
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
    super.set("definitions", this.mapProperties(definitions));

    return this;
  }

  /**
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
   */
  allOf<S extends Array<AnyJsonSchema | null>>(allOf: S): JsonSchema<UnionToIntersection<Infer<S[number]>>> {
    this.setManyOf("allOf", allOf);

    return this as JsonSchema<UnionToIntersection<Infer<S[number]>>>;
  }

  /**
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
   */
  anyOf<S extends Array<AnyJsonSchema | null>>(anyOf: S): JsonSchema<Infer<S[number]>> {
    this.setManyOf("anyOf", anyOf);

    return this as JsonSchema<Infer<S[number]>>;
  }

  /*
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
   */
  oneOf<S extends Array<AnyJsonSchema | null>>(oneOf: S): JsonSchema<Infer<S[number]>> {
    if (this.isCollection) {
      this.itemSchema().oneOf(oneOf);
    } else {
      this.setManyOf("oneOf", oneOf);
    }

    return this as JsonSchema<Infer<S[number]>>;
  }

  /**
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.29
   */
  not(not: AnyJsonSchema) {
    super.set("not", this.mapToJsonSchema(not));

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
  max(maximum: number) {
    return this.maximum(maximum);
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
  min(minimum: number) {
    return this.minimum(minimum);
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
  type(type: any | JSONSchema7TypeName | JSONSchema7TypeName[]): this {
    switch (type) {
      case "map":
      case Map:
        super.set("type", getJsonType(type));
        this.target(type);
        this.#isCollection = true;
        if (!this.has("additionalProperties")) {
          super.set("additionalProperties", this.itemSchema({}));
        }
        break;

      case "array":
      case Array:
        super.set("type", getJsonType(type));
        this.target(type);
        this.#isCollection = true;

        if (!this.has("items")) {
          super.set("items", this.itemSchema({}));
        }
        break;

      case "set":
      case Set:
        super.set("type", getJsonType(type));
        this.target(type);
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

        this.target(type);
        if (!this.has("properties")) {
          super.set("properties", {});
        }
        break;

      default:
        if (isClass(type) || isFunction(type)) {
          super.set("type", undefined);
          this.target(type);

          if (!this.has("properties")) {
            super.set("properties", {});
          }
        } else {
          const jsonType = getJsonType(type);
          if (jsonType === "generic") {
            this.genericLabel(type);
          } else {
            super.set("type", jsonType);
          }
        }
    }

    return this;
  }

  any(...types: any[]) {
    types = types.length ? types : ["integer", "number", "string", "boolean", "array", "object", "null"]; // should be simplified by no type

    types = uniq(types).map((o) => {
      return isClass(o) ? o : {type: getJsonType(o)};
    });

    if (types.length > 1) {
      this.oneOf(types);
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

  vendorKey(key: VendorKeys, value: any) {
    this.#vendors.set(key, value);

    return this;
  }

  toObject(options?: JsonSchemaOptions) {
    return this.toJSON(options);
  }

  toJSON(options?: JsonSchemaOptions) {
    return execMapper("schema", [this], options);
  }

  assign(obj: Partial<JSONSchema7> | JsonSchema | Record<string, unknown>) {
    const entries = obj instanceof JsonSchema ? [...obj.entries()] : Object.entries(obj);

    entries.forEach(([key, value]) => {
      this.set(key, value);
    });

    if (obj instanceof JsonSchema) {
      this.$selfRequired = obj.$selfRequired;
      this.$allow.push(...obj.$allow);

      this.#required = new Set(obj.#required.keys());
      this.#alias = new Map(this.#alias.entries());
      this.#vendors = new Map(obj.#vendors.entries());
      this.#discriminator = this.#discriminator ? new Discriminator(this.#discriminator) : null;
      this.isDiscriminator = obj.isDiscriminator;
      this.isDiscriminatorKey = obj.isDiscriminatorKey;
      this.#useRefLabel = obj.#useRefLabel;
      this.#target = obj.#target;
      this.#isCollection = obj.#isCollection;
      this.#isLocalSchema = obj.#isLocalSchema;

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
   * Return the JSON type as string
   */
  getJsonType(): string | string[] {
    if (this.get("anyOf")) {
      return this.get("anyOf").map((o: JsonSchema) => {
        return o.getJsonType();
      });
    }

    return this.get("type") || getJsonType(this.class);
  }

  getTarget() {
    return this.#target;
  }

  getAllowedGroups() {
    return this.get<Set<string>>(VendorKeys.ALLOWED_GROUPS);
  }

  getAllowedRequiredValues() {
    return this.$allow;
  }

  getGroups() {
    return this.get<string[]>(VendorKeys.GROUPS);
  }

  getGroupsName() {
    return this.get<string>(VendorKeys.GROUPS_NAME);
  }

  /**
   * Get the symbolic name of the entity
   */
  getName() {
    return this.get("name") || (isClass(this.#target) ? nameOf(classOf(this.class)) : "");
  }

  clone() {
    return new JsonSchema(this);
  }

  getGenericLabels(): string[] | undefined {
    const labels = this.get<string[]>(VendorKeys.GENERIC_LABELS);

    if (this.isClass && !labels) {
      const ancestor = ancestorOf(this.class);

      return ancestor === Object ? undefined : JsonSchema.from(ancestor).getGenericLabels();
    }

    return this.get<string[]>(VendorKeys.GENERIC_LABELS);
  }

  getGenericOf(): GenericsMap | undefined {
    return this.get(VendorKeys.GENERIC_OF);
  }

  /**
   * Returns the reference schema for class-based schemas.
   * Used to get the original schema definition when this schema is a local reference.
   * @returns The reference schema or undefined if not applicable
   */
  getRefSchema() {
    if (!this.isLocalSchema && this.isClass) {
      const refSchema = JsonSchema.from(this.class);

      if (refSchema !== this) {
        return refSchema;
      }
    }
  }

  propertyKey(s: string) {
    this.#propertyKey = s;
    return this;
  }

  getPropertyKey() {
    return this.#propertyKey;
  }

  target(target: any) {
    if (target === "object") {
      this.#target = Object;
    } else {
      this.#target = target;
    }
  }

  isRequiredValue(property: string, value: any): boolean {
    if (this.isRequired(property) && [undefined, null, ""].includes(value)) {
      const propertySchema = this.get("properties")?.[property];

      if (propertySchema) {
        return !propertySchema.getAllowedRequiredValues().includes(value);
      }
    }

    return false;
  }

  protected setManyOf(keyword: "oneOf" | "anyOf" | "allOf", value: (AnyJsonSchema | null)[]) {
    let resolved = value
      .filter((o) => {
        if ((o && "type" in o && o.type === "null") || o === null) {
          this.nullable(true);
          return false;
        }
        return true;
      })
      .map((item) => this.mapToJsonSchema(item));

    if (resolved.length === 1 && !(value[0] instanceof JsonSchema) && !this.isNullable) {
      if (!resolved[0].hasDiscriminator) {
        return this.type(value[0]);
      }

      const children = resolved[0].discriminator().children();

      if (!children.length) {
        return this.type(value[0]);
      }

      resolved = children.map((item) => this.mapToJsonSchema(item));
    }

    super.set(keyword, resolved);

    const jsonSchema: JsonSchema = resolved[0];

    if (jsonSchema?.isDiscriminator) {
      const discriminator = jsonSchema.discriminatorAncestor.discriminator();
      const {propertyName} = discriminator;

      super.set("discriminator", {
        propertyName,
        mapping: resolved.reduce((acc, schema: JsonSchema) => {
          discriminator.types.get(schema.getTarget())?.forEach((key: string) => {
            acc[key] = schema;
          });

          return acc;
        }, {} as any)
      });

      this.isDiscriminator = true;
      this.#discriminator = discriminator;
    }
  }

  protected mapToJsonSchema(item: any[]): JsonSchema[];
  protected mapToJsonSchema(item: any): JsonSchema;
  protected mapToJsonSchema(item: any | any[]): JsonSchema | JsonSchema[] {
    if (isArray(item)) {
      return (item as any[]).map((item) => this.mapToJsonSchema(item));
    }

    if (item && (item.isStore || item.$isJsonDocument || item.isLazyRef)) {
      return item;
    }

    if (item && classOf(item) !== Object && isClass(item)) {
      return JsonEntityStore.from(item).schema;
    }

    if (isObject(item)) {
      return JsonSchema.from(item as any);
    }

    if (isPrimitiveClass(item) || item === Date || item === null) {
      return JsonSchema.from({type: item});
    }

    return item;
  }

  protected mapGenerics(jsonSchema: JsonSchema, generics: GenericValue[][]) {
    const genericLabels = jsonSchema.getGenericLabels();

    if (!genericLabels) {
      return {};
    }

    const [types, ...nextTypes] = generics;

    return types.reduce((mapping: GenericsMap, type, index) => {
      const label = genericLabels[index];

      if (label) {
        if (isEnum(type)) {
          mapping[label] = [JsonSchema.from({type: "string", enum: Object.values(type)})];
        } else if (nextTypes.length) {
          const nextSchema = this.mapToJsonSchema(type);

          mapping[label] = [nextSchema, this.mapGenerics(nextSchema, nextTypes)];
        } else {
          mapping[label] = [this.mapToJsonSchema(type)];
        }
      }

      return mapping;
    }, {} as GenericsMap) as GenericsMap;
  }

  protected mapProperties(properties: Record<string, any>) {
    // istanbul ignore next
    if (properties instanceof JsonSchema) {
      return properties;
    }

    return Object.entries(properties).reduce<any>((properties, [key, schema]) => {
      properties[toJsonRegex(key)] = this.mapToJsonSchema(schema);
      if (schema instanceof JsonSchema) {
        schema.propertyKey(toJsonRegex(key));
      }

      return properties;
    }, {});
  }
}
