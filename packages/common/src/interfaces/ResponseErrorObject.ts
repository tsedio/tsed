/**
 * Interface can be implemented to customize the error sent to the client.
 */
export interface ResponseErrorObject extends Error {
  errors?: Error[] | Error | any;
  origin?: Error;
  headers?: {};
}
