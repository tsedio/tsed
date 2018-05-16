import {IResponseHeaders} from "./IResponseHeaders";

/**
 * Interface can be implemented to customize the error sent to the client.
 */
export interface IResponseError extends Error {
  errors?: any[];
  origin?: Error;
  headers?: IResponseHeaders;
}
