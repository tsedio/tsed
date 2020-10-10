import {OpenSpecExternalDocs} from "../common/OpenSpecExternalDocs";
import {OpenSpecBaseJsonSchema, OpenSpecJsonSchema} from "../common/OpenSpecJsonSchema";
import {OpenSpecRef} from "../common/OpenSpecRef";
import {OpenSpecXML} from "../common/OpenSpecXML";

export interface OS2XML {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

export interface OS2BaseSchema extends OpenSpecBaseJsonSchema {
  /**
   * Required if type is "array". Describes the type of items in the array.
   */
  items?: OS2Schema | OpenSpecRef;
}

export interface OS2Schema extends OpenSpecJsonSchema<OS2Schema> {
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
   * This MAY be used only on properties schemas. It has no effect on root schemas. Adds Additional metadata to describe the XML representation format of this property.
   */
  xml?: OpenSpecXML;
  /**
   * Additional external documentation for this schema.
   */
  externalDocs?: OpenSpecExternalDocs;
}
