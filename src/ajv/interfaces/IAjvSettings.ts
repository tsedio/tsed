import {ErrorObject} from "ajv";

/**
 *
 */

// tslint:disable-next-line: no-unused-variable
declare interface IServerSettings {
  ajv: IAjvSettings;
}

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
