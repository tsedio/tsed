/**
 *
 */
export interface IErrorsSettings {
  /**
   * Change the name of the header field used by GlobalErrorHandlerMiddleware
   * to sent the errors in the response headers.
   */
  headerName?: string;
}
