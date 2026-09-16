import {DIContext, type DIContextOptions} from "@tsed/di";
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
  Input & {
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
  readonly #requestUrl: URL;
  readonly PLATFORM = "FETCH";
  readonly request: Request;
  /** The request URL, including its query string. */
  readonly url: string;
  /** The HTTP method received by the Fetch request. */
  readonly method: string;
  /** The pathname of `url`, without its query string. */
  readonly path: string;
  /** The route pattern selected by the router, for example `/users/:id`. */
  readonly route?: string;
  readonly params: Input["params"];
  readonly query: Input["query"];
  readonly headers: Input["headers"];
  readonly body: Input["body"];
  readonly response: FetchResponse;

  constructor(options: FetchContextOptions<Input>) {
    super(options);

    this.request = options.request;
    this.#requestUrl = new URL(options.request.url);
    this.url = options.request.url;
    this.method = options.request.method;
    this.path = this.#requestUrl.pathname;
    this.route = options.route;
    this.params = options.params as Input["params"];
    this.query = options.query as Input["query"];
    this.headers = options.headers as Input["headers"];
    this.body = options.body as Input["body"];
    this.response = new FetchResponse(options.response);
  }

  /** The URL origin, for example `https://api.example.com`. */
  get origin(): string {
    return this.#requestUrl.origin;
  }

  /** The URL protocol, for example `https:`. */
  get protocol(): string {
    return this.#requestUrl.protocol;
  }

  /** The request host, including its port when present. */
  get host(): string {
    return this.#requestUrl.host;
  }

  /** The request hostname without its port. */
  get hostname(): string {
    return this.#requestUrl.hostname;
  }

  /** The request port, or an empty string when the URL has no explicit port. */
  get port(): string {
    return this.#requestUrl.port;
  }

  /** The URL query string, including its leading `?` when present. */
  get search(): string {
    return this.#requestUrl.search;
  }

  /** The raw URL query parameters, before endpoint decoding. */
  get searchParams(): URLSearchParams {
    return this.#requestUrl.searchParams;
  }

  /** The URL fragment, including its leading `#` when present. */
  get hash(): string {
    return this.#requestUrl.hash;
  }
}
