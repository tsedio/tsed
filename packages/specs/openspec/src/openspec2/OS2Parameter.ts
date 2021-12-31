import {OpenSpecTypes} from "../common/OpenSpecTypes";
import {OS2BaseSchema, OS2Schema} from "./OS2Schema";

/**
 * @deprecated
 */
export type OS2BaseParameter = {
  name: string;
  in: "body" | "query" | "path" | "header" | "formData";
  required?: boolean;
  description?: string;
};

/**
 * @deprecated
 */
export type OS2BodyParameter = OS2BaseParameter & {
  in: "body";
  schema?: OS2Schema;
};

/**
 * @deprecated
 */
export type OS2GenericFormat = {
  type?: OpenSpecTypes;
  format?: string;
};

/**
 * @deprecated
 */
export type OS2IntegerFormat = {
  type: "integer";
  format?: "int32" | "int64";
};

/**
 * @deprecated
 */
export type OS2NumberFormat = {
  type: "number";
  format?: "float" | "double";
};

/**
 * @deprecated
 */
export type OS2StringFormat = {
  type: "string";
  format?: "" | "byte" | "binary" | "date" | "date-time" | "password";
};

/**
 * @deprecated
 */
export type OS2SchemaFormatConstraints = OS2GenericFormat | OS2IntegerFormat | OS2NumberFormat | OS2StringFormat;
/**
 * @deprecated
 */
export type OS2BaseFormatContrainedParameter = OS2BaseParameter & OS2SchemaFormatConstraints;
/**
 * @deprecated
 */
export type ParameterCollectionFormat = "csv" | "ssv" | "tsv" | "pipes" | "multi";

/**
 * @deprecated
 */
export type OS2QueryParameter = OS2BaseFormatContrainedParameter &
  OS2BaseSchema & {
    in: "query";
    allowEmptyValue?: boolean;
    collectionFormat?: ParameterCollectionFormat;
  };

/**
 * @deprecated
 */
export type OS2PathParameter = OS2BaseFormatContrainedParameter &
  OS2BaseSchema & {
    in: "path";
    required: true;
  };

/**
 * @deprecated
 */
export type OS2HeaderParameter = OS2BaseFormatContrainedParameter &
  OS2BaseSchema & {
    in: "header";
  };

/**
 * @deprecated
 */
export type OS2FormDataParameter = OS2BaseFormatContrainedParameter &
  OS2BaseSchema & {
    in: "formData";
    type: OpenSpecTypes;
    allowEmptyValue?: boolean;
    collectionFormat?: ParameterCollectionFormat;
  };

/**
 * @deprecated
 */
export type OS2Parameter = OS2BodyParameter | OS2FormDataParameter | OS2QueryParameter | OS2PathParameter | OS2HeaderParameter;
