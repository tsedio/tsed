/** HTTP methods supported by the Fetch router. */
export type FetchMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

/** A schema descriptor consumed by an adapter. */
export type FetchSchema = unknown;

/** Schema descriptors for values extracted from a request. */
export interface FetchEndpointSchemas {
  params?: FetchSchema;
  query?: FetchSchema;
  headers?: FetchSchema;
  body?: FetchSchema;
}

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

/** Values an endpoint handler can return before the host creates a `Response`. */
export type FetchHandlerResult<Output = unknown> = Output | Response | void;

/** A Fetch-native endpoint handler. */
export type FetchHandler<Input extends FetchEndpointInput = FetchEndpointInput, Output = unknown> = (
  context: FetchContext<Input>
) => FetchHandlerResult<Output> | Promise<FetchHandlerResult<Output>>;

/** Documentation metadata for the response produced by a handler. */
export interface FetchResponseOptions {
  description?: string;
  contentType?: string;
  headers?: FetchSchema;
  schema?: FetchSchema;
}

/** Response metadata indexed by HTTP status code. */
export type FetchEndpointOutput = Record<number, FetchResponseOptions>;

/**
 * A declarative endpoint contract.
 *
 * `input` and `output` are metadata only. Parsing, validation, serialization,
 * and OpenAPI generation are deliberately delegated to adapters.
 */
export interface FetchEndpointOptions<Input extends FetchEndpointInput = FetchEndpointInput, Output = unknown> {
  method: FetchMethod;
  path: string;
  input?: FetchEndpointSchemas;
  output?: FetchEndpointOutput;
  handler: FetchHandler<Input, Output>;
}
