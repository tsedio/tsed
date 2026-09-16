import {DIContext, type DIContextOptions} from "@tsed/di";

/**
 * Values made available to a handler after the request has been decoded.
 */
export interface FetchEndpointInput {
  params?: unknown;
  query?: unknown;
  headers?: unknown;
  body?: unknown;
}

/**
 * Values used to create a Fetch request context.
 */
export type FetchContextOptions<Input extends FetchEndpointInput = FetchEndpointInput> = DIContextOptions &
  Input & {
    request: Request;
  };

/**
 * Fetch-native request scope exposed to an endpoint handler.
 *
 * The adapter creates it after decoding the request and owns its lifecycle.
 * It deliberately exposes no mutable response or state bag.
 */
export class FetchContext<Input extends FetchEndpointInput = FetchEndpointInput> extends DIContext {
  readonly PLATFORM = "FETCH";
  readonly request: Request;
  readonly params: Input["params"];
  readonly query: Input["query"];
  readonly headers: Input["headers"];
  readonly body: Input["body"];

  constructor(options: FetchContextOptions<Input>) {
    super(options);

    this.request = options.request;
    this.params = options.params as Input["params"];
    this.query = options.query as Input["query"];
    this.headers = options.headers as Input["headers"];
    this.body = options.body as Input["body"];
  }
}
