import {DIContext, type DIContextOptions} from "@tsed/di";
import {FetchRequest} from "./FetchRequest.js";
import {FetchResponse} from "./FetchResponse.js";

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
  Omit<Input, "body"> & {
    request: Request;
    response?: ResponseInit;
    /** The declared route pattern selected by the router. */
    route?: string;
  };

/**
 * Fetch-native request scope exposed to an endpoint handler.
 *
 * The adapter creates it after decoding the request and owns its lifecycle.
 * `response` only records Fetch response metadata; it never exposes a platform
 * response nor a generic state bag.
 */
export class FetchContext<Input extends FetchEndpointInput = FetchEndpointInput> extends DIContext {
  readonly PLATFORM = "FETCH";
  readonly request: FetchRequest<Input>;
  readonly response: FetchResponse;

  constructor(options: FetchContextOptions<Input>) {
    super(options);

    this.request = new FetchRequest(options);
    this.response = new FetchResponse(options.response);
  }
}
