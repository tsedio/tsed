import type {FetchEndpointInput} from "./FecthContext.js";

/**
 * Values resolved by the router for a request matched to an endpoint.
 */
export type FetchRequestOptions<Input extends FetchEndpointInput = FetchEndpointInput> = Omit<Input, "body"> & {
  request: Request;
  /** The declared route pattern selected by the router. */
  route?: string;
};

/**
 * Server-oriented request capabilities that are not provided by `Request`.
 *
 * `raw` remains the original runtime `Request`, so native Fetch APIs are
 * always available without copying or reconstructing the request.
 */
export class FetchRequest<Input extends FetchEndpointInput = FetchEndpointInput> {
  /**
   * The request URL, including its query string.
   */
  readonly url: string;
  /**
   * The HTTP method received by the Fetch request.
   */
  readonly method: string;
  /**
   * The pathname of `url`, without its query string.
   */
  readonly path: string;
  /**
   * The route pattern selected by the router, for example `/users/:id`.
   */
  readonly route?: string;
  /**
   * Values decoded from the route path.
   */
  readonly params: Input["params"];
  /**
   * Values decoded from the URL query string.
   */
  readonly query: Input["query"];
  /**
   * Request headers decoded according to the endpoint contract.
   */
  readonly headers: Input["headers"];
  readonly raw: Request;
  readonly #url: URL;
  #parsedBody?: Promise<unknown>;

  constructor(options: FetchRequestOptions<Input>) {
    this.#url = new URL(options.request.url);
    this.raw = options.request;
    this.url = options.request.url;
    this.method = options.request.method;
    this.path = this.#url.pathname;
    this.route = options.route;
    this.params = options.params as Input["params"];
    this.query = options.query as Input["query"];
    this.headers = options.headers as Input["headers"];
  }

  /** The URL origin, for example `https://api.example.com`. */
  get origin(): string {
    return this.#url.origin;
  }

  /** The URL protocol, for example `https:`. */
  get protocol(): string {
    return this.#url.protocol;
  }

  /** The request host, including its port when present. */
  get host(): string {
    return this.#url.host;
  }

  /** The request hostname without its port. */
  get hostname(): string {
    return this.#url.hostname;
  }

  /** The request port, or an empty string when the URL has no explicit port. */
  get port(): string {
    return this.#url.port;
  }

  /** The URL query string, including its leading `?` when present. */
  get search(): string {
    return this.#url.search;
  }

  /** The raw URL query parameters, before endpoint decoding. */
  get searchParams(): URLSearchParams {
    return this.#url.searchParams;
  }

  /** The URL fragment, including its leading `#` when present. */
  get hash(): string {
    return this.#url.hash;
  }

  /**
   * Lazily parses the request body from its `Content-Type`.
   *
   * JSON media types use `Request.json()`, form media types use
   * `Request.formData()`, `text/*` uses `Request.text()`, and other media
   * types preserve their bytes as an `ArrayBuffer`. The first parsed result is
   * cached because a Fetch body stream is consumable only once.
   */
  body<Data = Input["body"]>(): Promise<Data> {
    return (this.#parsedBody ??= this.parseRawBody()) as Promise<Data>;
  }

  private parseRawBody(): Promise<unknown> {
    if (!this.raw.body) {
      return Promise.resolve(undefined);
    }

    const contentType = this.raw.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();

    if (contentType === "application/json" || contentType?.endsWith("+json")) {
      return this.raw.json();
    }

    if (contentType === "multipart/form-data" || contentType === "application/x-www-form-urlencoded") {
      return this.raw.formData();
    }

    if (contentType?.startsWith("text/")) {
      return this.raw.text();
    }

    return this.raw.arrayBuffer();
  }
}
