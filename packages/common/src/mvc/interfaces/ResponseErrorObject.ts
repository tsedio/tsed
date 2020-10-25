/**
 * Interface can be implemented to customize the error sent to the client.
 */
export interface ResponseErrorObject extends Error {
  errors?: any[];
  origin?: Error;
  headers?: {};
}
