/** Values made available to a handler after the request has been decoded. */
export interface FetchEndpointInput {
  params?: unknown;
  query?: unknown;
  headers?: unknown;
  body?: unknown;
}

/** Request-scoped values exposed to an endpoint handler. */
export interface FetchContext<Input extends FetchEndpointInput = FetchEndpointInput> {
  request: Request;
  params: Input["params"];
  query: Input["query"];
  headers: Input["headers"];
  body: Input["body"];
}
