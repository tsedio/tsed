/**
 * Mutable response metadata collected during a Fetch endpoint invocation.
 *
 * The router applies this metadata when it serializes the handler result. It
 * never writes to a platform response directly.
 */
export class FetchResponse {
  readonly #headers: Headers;
  #status?: number;
  #statusText?: string;

  constructor(init: ResponseInit = {}) {
    this.#headers = new Headers(init.headers);
    this.#status = init.status;
    this.#statusText = init.statusText;
  }

  /** The response status selected by the handler, when one was selected. */
  get statusCode(): number | undefined {
    return this.#status;
  }

  /** Sets the HTTP response status. */
  status(status: number): this {
    this.#status = status;
    return this;
  }

  /** Sets an HTTP response header, replacing any existing value. */
  header(name: string, value: string): this {
    this.#headers.set(name, value);
    return this;
  }

  /** Returns an HTTP response header value. */
  getHeader(name: string): string | null {
    return this.#headers.get(name);
  }

  /** Returns whether an HTTP response header was set. */
  hasHeader(name: string): boolean {
    return this.#headers.has(name);
  }

  /** Appends an HTTP response header value, for example `Set-Cookie`. */
  appendHeader(name: string, value: string): this {
    this.#headers.append(name, value);
    return this;
  }

  /** Sets several HTTP response headers. */
  setHeaders(headers: HeadersInit): this {
    new Headers(headers).forEach((value, name) => this.#headers.set(name, value));
    return this;
  }

  /** Sets the response `Content-Type` header. */
  contentType(contentType: string): this {
    return this.header("content-type", contentType);
  }

  /** Sets the optional HTTP response status text. */
  statusText(statusText: string): this {
    this.#statusText = statusText;
    return this;
  }

  /**
   * Returns a snapshot consumable by `Response`, `Response.json`, or the
   * router's automatic value serialization.
   */
  toResponseInit(): ResponseInit {
    return {
      headers: this.#headers,
      ...(this.#status === undefined ? {} : {status: this.#status}),
      ...(this.#statusText === undefined ? {} : {statusText: this.#statusText})
    };
  }

  /** Creates a native Fetch `Response` using the collected metadata. */
  toResponse(body: BodyInit | null = null): Response {
    return new Response(body, this.toResponseInit());
  }

  /** Creates a native JSON response using the collected metadata. */
  json<Data>(data: Data): Response {
    return Response.json(data, this.toResponseInit());
  }

  /** Creates a native text response. */
  text(text: string): Response {
    this.hasHeader("content-type") || this.contentType("text/plain;charset=UTF-8");
    return this.toResponse(text);
  }

  /** Creates a native HTML response. */
  html(html: string): Response {
    this.hasHeader("content-type") || this.contentType("text/html;charset=UTF-8");
    return this.toResponse(html);
  }

  /** Creates a native redirect response. */
  redirect(location: string, status = 302): Response {
    return this.status(status).header("location", location).toResponse();
  }
}
