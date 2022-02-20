import {OpenSpecExternalDocs} from "../common/OpenSpecExternalDocs";
import {OpenSpecBaseJsonSchema, OpenSpecJsonSchema} from "../common/OpenSpecJsonSchema";
import {OpenSpecRef} from "../common/OpenSpecRef";
import {OpenSpecXML} from "../common/OpenSpecXML";

export interface OS3BaseSchema extends OpenSpecBaseJsonSchema {
  /**
   * Required if type is "array". Describes the type of items in the array.
   */
  items?: OS3Schema | OpenSpecRef;
}

export interface OS3Schema extends OpenSpecJsonSchema<OS3Schema> {
  /**
   * Inline or referenced schema MUST be of a [Schema Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#schemaObject) and not a standard JSON Schema.
   */
  oneOf?: (OS3Schema | OpenSpecRef)[];
  /**
   * Inline or referenced schema MUST be of a [Schema Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#schemaObject) and not a standard JSON Schema.
   */
  anyOf?: (OS3Schema | OpenSpecRef)[];
  /**
   * Inline or referenced schema MUST be of a [Schema Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#schemaObject) and not a standard JSON Schema.
   */
  not?: OS3Schema | OpenSpecRef;
  /**
   * Allows sending a null value for the defined schema. Default value is false.
   */
  nullable?: boolean;
  /**
   * Adds support for polymorphism.
   * The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the required property list. When used, the value MUST be the name of this schema or any schema that inherits it.
   */
  discriminator?: string;
  /**
   * Relevant only for Schema "properties" definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but MUST NOT be sent as part of the request. Properties marked as readOnly being true SHOULD NOT be in the required list of the defined schema. Default value is false.
   */
  readOnly?: boolean;
  /**
   * Relevant only for Schema "properties" definitions. Declares the property as "write only". Therefore, it MAY be sent as part of a request but SHOULD NOT be sent as part of the response. If the property is marked as writeOnly being true and is in the required list, the required will take effect on the request only. A property MUST NOT be marked as both readOnly and writeOnly being true. Default value is false.
   */
  writeOnly?: boolean;
  /**
   * This MAY be used only on properties schemas. It has no effect on root schemas. Adds Additional metadata to describe the XML representation format of this property.
   */
  xml?: OpenSpecXML;
  /**
   * Additional external documentation for this schema.
   */
  externalDocs?: OpenSpecExternalDocs;
}
