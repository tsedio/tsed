import type {OpenSpecHash} from "./OpenSpecHash.js";
import type {OpenSpecRef} from "./OpenSpecRef.js";
import type {OpenSpecTypes} from "./OpenSpecTypes.js";

export interface OpenSpecBaseJsonSchema {
  $ref?: string;
  /**
   * This attribute is a string that provides a short description of the instance property.
   *
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.2
   */
  title?: string;
  /**
   * Must be strictly greater than 0.
   * A numeric instance is valid only if division by this keyword's value results in an integer.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.1
   */
  multipleOf?: number;
  /**
   * Representing an inclusive upper limit for a numeric instance.
   * This keyword validates only if the instance is less than or exactly equal to "maximum".
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.2
   */
  maximum?: number;
  /**
   * Representing an exclusive upper limit for a numeric instance.
   * This keyword validates only if the instance is strictly less than (not equal to) to "exclusiveMaximum".
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.3
   */
  exclusiveMaximum?: boolean;
  /**
   * Representing an inclusive lower limit for a numeric instance.
   * This keyword validates only if the instance is greater than or exactly equal to "minimum".
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.4
   */
  minimum?: number;
  /**
   * Representing an exclusive lower limit for a numeric instance.
   * This keyword validates only if the instance is strictly greater than (not equal to) to "exclusiveMinimum".
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.5
   */
  exclusiveMinimum?: boolean;
  /**
   * Must be a non-negative integer.
   * A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.6
   */
  maxLength?: number;
  /**
   * Must be a non-negative integer.
   * A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.
   * Omitting this keyword has the same behavior as a value of 0.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.7
   */
  minLength?: number;
  /**
   * Should be a valid regular expression, according to the ECMA 262 regular expression dialect.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.8
   */
  pattern?: string;
  /**
   * Must be a non-negative integer.
   * An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.11
   */
  maxItems?: number;
  /**
   * Must be a non-negative integer.
   * An array instance is valid against "maxItems" if its size is greater than, or equal to, the value of this keyword.
   * Omitting this keyword has the same behavior as a value of 0.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.12
   */
  minItems?: number;
  /**
   * If this keyword has boolean value false, the instance validates successfully.
   * If it has boolean value true, the instance validates successfully if all of its elements are unique.
   * Omitting this keyword has the same behavior as a value of false.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.13
   */
  uniqueItems?: boolean;
  /**
   * Must be a non-negative integer.
   * An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.15
   */
  maxProperties?: number;
  /**
   * Must be a non-negative integer.
   * An object instance is valid against "maxProperties" if its number of properties is greater than,
   * or equal to, the value of this keyword.
   * Omitting this keyword has the same behavior as a value of 0.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.16
   */
  minProperties?: number;
  /**
   * This provides an enumeration of all possible values that are valid
   * for the instance property. This MUST be an array, and each item in
   * the array represents a possible value for the instance value. If
   * this attribute is defined, the instance value MUST be one of the
   * values in the array in order for the schema to be valid.
   *
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.23
   */
  enum?: any[];
  /**
   * This attribute is a string that provides a full description of the of purpose the instance property.
   *
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.2
   */
  description?: string;
  /**
   * This keyword can be used to supply a default JSON value associated with a particular schema.
   * It is RECOMMENDED that a default value be valid against the associated schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.3
   */
  default?: any;
  /**
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-8
   */
  format?: string;
  /**
   * A single type, or a union of simple types
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.25
   */
  type?: OpenSpecTypes;
}

export interface OpenSpecJsonSchema<Schema = any> extends OpenSpecBaseJsonSchema {
  /**
   * Required if type is "array". Describes the type of items in the array.
   */
  items?: Schema | OpenSpecRef;
  /**
   * A free-form property to include an example of an instance for this schema.
   */
  required?: string[];
  /**
   * Value can be boolean or object. Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema.
   */
  additionalProperties?: Schema | boolean;
  /**
   * Property definitions MUST be a Schema Object and not a standard JSON Schema (inline or referenced).
   */
  properties?: OpenSpecHash<Schema>;
  /**
   * Inline or referenced schema MUST be of a [Schema Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#schemaObject) and not a standard JSON Schema.
   */
  allOf?: (Schema | OpenSpecRef)[];
  /**
   * Additional external documentation for this schema.
   */
  example?: any;
}
