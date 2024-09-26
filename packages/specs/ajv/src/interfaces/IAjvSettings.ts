import type {ErrorObject, Options} from "ajv";

/**
 *
 */
export interface AjvErrorObject extends ErrorObject {
  modelName: string;
  collectionName?: string;
}

/**
 *
 */
export type ErrorFormatter = (error: AjvErrorObject) => string;

/**
 *
 */
export interface IAjvSettings extends Options {
  Ajv?: any;
  errorFormatter?: ErrorFormatter;
  returnsCoercedValues?: boolean;
}
