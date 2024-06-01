import {OpenSpecTypes} from "../common/OpenSpecTypes.js";
import {OS2BaseSchema, OS2Schema} from "./OS2Schema.js";

export type OS2BaseParameter = {
  name: string;
  in: "body" | "query" | "path" | "header" | "formData";
  required?: boolean;
  description?: string;
};

export type OS2BodyParameter = OS2BaseParameter & {
  in: "body";
  schema?: OS2Schema;
};

export type OS2GenericFormat = {
  type?: OpenSpecTypes;
  format?: string;
};

export type OS2IntegerFormat = {
  type: "integer";
  format?: "int32" | "int64";
};

export type OS2NumberFormat = {
  type: "number";
  format?: "float" | "double";
};

export type OS2StringFormat = {
  type: "string";
  format?: "" | "byte" | "binary" | "date" | "date-time" | "password";
};

export type OS2SchemaFormatConstraints = OS2GenericFormat | OS2IntegerFormat | OS2NumberFormat | OS2StringFormat;
export type OS2BaseFormatContrainedParameter = OS2BaseParameter & OS2SchemaFormatConstraints;
export type ParameterCollectionFormat = "csv" | "ssv" | "tsv" | "pipes" | "multi";
export type OS2QueryParameter = OS2BaseFormatContrainedParameter &
  OS2BaseSchema & {
    in: "query";
    allowEmptyValue?: boolean;
    collectionFormat?: ParameterCollectionFormat;
  };

export type OS2PathParameter = OS2BaseFormatContrainedParameter &
  OS2BaseSchema & {
    in: "path";
    required: true;
  };

export type OS2HeaderParameter = OS2BaseFormatContrainedParameter &
  OS2BaseSchema & {
    in: "header";
  };

export type OS2FormDataParameter = OS2BaseFormatContrainedParameter &
  OS2BaseSchema & {
    in: "formData";
    type: OpenSpecTypes;
    allowEmptyValue?: boolean;
    collectionFormat?: ParameterCollectionFormat;
  };

export type OS2Parameter = OS2BodyParameter | OS2FormDataParameter | OS2QueryParameter | OS2PathParameter | OS2HeaderParameter;
