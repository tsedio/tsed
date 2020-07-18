import {ErrorObject, Options} from "ajv";

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
  /**
   * @deprecated Use errorFormatter instead
   */
  errorFormat?: ErrorFormatter;
  errorFormatter?: ErrorFormatter;
  /**
   * @deprecated set options directly on ajv root object.
   */
  options?: Options;
}
