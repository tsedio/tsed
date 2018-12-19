import {ErrorObject} from "ajv";

/**
 *
 */
export interface AjvErrorObject extends ErrorObject {
  modelName: string;
}

/**
 *
 */
export type ErrorFormatter = (error: AjvErrorObject) => string;

/**
 *
 */
export interface IAjvSettings {
  errorFormat?: ErrorFormatter;
  options?: IAjvOptions;
}

/**
 *
 */
export interface IAjvOptions {
  verbose?: boolean;
}
