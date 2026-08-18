import {Readable} from "node:stream";
import type {OutgoingHttpHeaders, ServerResponse} from "node:http";
import {injectable, lazyInject, ProviderScope} from "@tsed/di";
import {isBoolean, isNumber, isStream, isString} from "@tsed/core";
import type {PlatformContext} from "../domain/PlatformContext.js";
import type {PlatformRequest} from "./PlatformRequest.js";
import encodeUrl from "encodeurl";
import {getStatusMessage} from "@tsed/schema";

declare global {
  namespace TsED {
    // @ts-ignore
    export interface Response {}

    export interface SetCookieOpts extends Record<string, unknown> {
      maxAge?: number | undefined;
      signed?: boolean | undefined;
      expires?: Date | undefined;
      httpOnly?: boolean | undefined;
      path?: string | undefined;
      domain?: string | undefined;
      secure?: boolean | undefined;
      encode?: ((val: string) => string) | undefined;
      sameSite?: boolean | "lax" | "strict" | "none" | undefined;
    }
  }
}

/**
 * A cookie operation requested by portable response code. Serialization belongs
 * to the active host bridge because cookie support is a host capability.
 */
export interface PlatformCookieMutation {
  name: string;
  value: string | null;
  options?: TsED.SetCookieOpts;
}

function isWebReadableStream(value: unknown): value is ReadableStream {
  return Boolean(value && typeof (value as ReadableStream).getReader === "function");
}

function isNodeReadableStream(value: unknown): value is Readable {
  return Boolean(value && typeof (value as Readable).pipe === "function");
}

/**
 * Platform Response abstraction layer.
 * @platform
 */
export class PlatformResponse<Res extends Record<string, any> = any> {
  data: any;
  #status = 200;
  #statusText?: string;
  #body: BodyInit | null = null;
  #finalized = false;
  #bodyCommitted = false;
  readonly #headers = new Headers();
  readonly #cookies = new Map<string, PlatformCookieMutation>();

  constructor(readonly $ctx: PlatformContext) {}

  /**
   * The current @@PlatformRequest@@.
   */
  get request(): PlatformRequest {
    return this.$ctx.request;
  }

  get native(): Res | undefined {
    return this.$ctx.event.response as any;
  }

  /**
   * Non-portable alias for {@link native}.
   */
  get raw(): Res | undefined {
    return this.native;
  }

  /**
   * Get the current statusCode
   */
  get statusCode() {
    return this.#status;
  }

  /**
   * An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.
   *
   * This property is useful for exposing request-level information such as the request path name, authenticated user, user settings, and so on.
   */
  get locals() {
    return this.native?.locals;
  }

  /**
   * Return the original response framework instance
   */
  get response() {
    return this.getResponse();
  }

  /**
   * Return the original response node.js instance
   */
  get res() {
    return this.getRes();
  }

  /**
   * Returns the HTTP response header specified by field. The match is case-insensitive.
   *
   * ```typescript
   * response.get('Content-Type') // => "text/plain"
   * ```
   *
   * @param name
   */
  get(name: string) {
    return this.#headers.get(name);
  }

  getHeaders(): OutgoingHttpHeaders {
    return Object.fromEntries(this.#headers.entries());
  }

  /**
   * Return the Framework response object (express, koa, etc...)
   */
  getResponse<R = Res>(): R {
    return this.native as any;
  }

  /**
   * Return the Node.js response object
   */
  getRes(): ServerResponse {
    return this.native as any;
  }

  hasStatus() {
    return this.#status !== 200;
  }

  /**
   * Sets the HTTP status for the response.
   *
   * @param status
   */
  status(status: number) {
    this.assertMutable();
    this.#status = status;

    return this;
  }

  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * Examples:
   * ```typescript
   * response.setHeaders({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   * ```
   *
   * Aliased as `res.header()`.
   */
  setHeaders(headers: OutgoingHttpHeaders) {
    // apply headers
    Object.entries(headers).forEach(([key, item]) => {
      this.setHeader(key, item);
    });

    return this;
  }

  setHeader(key: string, item: any) {
    const value = this.formatHeader(key, item);

    this.assertMutable();
    this.#headers.set(key, String(value));

    return this;
  }

  /**
   * Set `Content-Type` response header with `type` through `mime.lookup()`
   * when it does not contain "/", or set the Content-Type to `type` otherwise.
   *
   * Examples:
   *
   *     res.type('.html');
   *     res.type('html');
   *     res.type('json');
   *     res.type('application/json');
   *     res.type('png');
   */
  contentType(contentType: string) {
    this.assertMutable();
    this.#headers.set("content-type", contentType);

    return this;
  }

  contentLength(length: number) {
    this.setHeader("Content-Length", length);
    return this;
  }

  getContentLength() {
    const contentLength = this.get("Content-Length");
    if (contentLength) {
      return parseInt(contentLength, 10) || 0;
    }
  }

  getContentType() {
    return (this.get("Content-Type") || "").split(";")[0];
  }

  /**
   * Sets the HTTP response Content-Disposition header field to “attachment”.
   * If a filename is given, then it sets the Content-Type based on the extension name via res.type(), and sets the Content-Disposition “filename=” parameter.
   *
   * ```typescript
   * res.attachment()
   * // Content-Disposition: attachment
   *
   * res.attachment('path/to/logo.png')
   * // Content-Disposition: attachment; filename="logo.png"
   * // Content-Type: image/png
   * ```
   *
   * @param filename
   */
  attachment(filename: string) {
    this.setHeader("content-disposition", `attachment; filename=\"${filename.replaceAll('"', '\\"')}\"`);
    return this;
  }

  /**
   * Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).
   * If not specified, status defaults to `302 Found`.
   *
   * @param status
   * @param url
   */
  redirect(status: number, url: string): this {
    status = status || 302;

    this.location(url);

    // Set location header
    url = this.get("Location") || "/";

    const txt = `${getStatusMessage(status)}. Redirecting to ${url}`;

    this.status(status);

    if (this.request.method === "HEAD") {
      this.end();
    } else {
      this.setHeader("Content-Length", new TextEncoder().encode(txt).byteLength).end(txt);
    }

    return this;
  }

  /**
   * Sets the response Location HTTP header to the specified path parameter.
   *
   * @param location
   */
  location(location: string): this {
    this.setHeader("Location", location);

    return this;
  }

  /**
   * Stream the given data.
   *
   * @param data
   */
  stream(data: any) {
    this.assertMutable();
    this.#body = isWebReadableStream(data)
      ? data
      : isNodeReadableStream(data)
        ? (Readable.toWeb(data) as ReadableStream)
        : (undefined as never);

    if (!this.#body) {
      throw new Error("PlatformResponse.stream() requires a web or Node readable stream");
    }

    this.#bodyCommitted = true;

    return this;
  }

  /**
   * Renders a view and sends the rendered HTML string to the client.
   *
   * @param path
   * @param options
   */
  async render(path: string, options: any = {}) {
    const platformViews = await lazyInject(() => import("@tsed/platform-views"));

    return platformViews.render(path, {
      ...this.locals,
      ...options
    }) as unknown as string;
  }

  /**
   * Send any data to your consumer.
   *
   * This method accept a ReadableStream, a plain object, boolean, string, number, null and undefined data.
   * It chooses the better way to send the data.
   *
   * @param data
   */
  body(data: any) {
    this.data = data;

    if (data === undefined) {
      this.assertMutable();
      this.#body = null;
      this.#bodyCommitted = true;
      return this;
    }

    if (isStream(data)) {
      this.stream(data);

      return this;
    }

    if (data instanceof Uint8Array) {
      this.assertMutable();
      this.#body = data as unknown as BodyInit;
      this.#bodyCommitted = true;
      this.buffer(data);

      return this;
    }

    if (isBoolean(data) || isNumber(data) || isString(data) || data === null) {
      if (data === null) {
        this.status(204);
      }

      this.assertMutable();
      this.#body = data === null ? null : String(data);
      this.#bodyCommitted = true;
      return this;
    }

    this.json(data);

    return this;
  }

  getBody() {
    return this.data;
  }

  /**
   * Add a listener to handler the end of the request/response.
   * @param cb
   */
  onEnd(cb: () => Promise<void> | void): this {
    this.getRes()?.on?.("finish", cb);

    return this;
  }

  isDone(): boolean {
    if (this.$ctx.isFinished()) {
      return true;
    }

    if (this.#bodyCommitted || this.#finalized) {
      return true;
    }

    return false;
  }

  isHeadersSent() {
    return this.#finalized;
  }

  cookie(name: string, value: string | null, opts?: TsED.SetCookieOpts) {
    this.assertMutable();
    this.#cookies.set(name, {name, value, options: opts});

    return this;
  }

  /**
   * Cookie operations collected during this request. A host bridge applies them
   * exactly once while writing the finalized response.
   */
  getCookies(): ReadonlyMap<string, PlatformCookieMutation> {
    return this.#cookies;
  }

  /**
   * Materialize the accumulated portable state as a Fetch response.
   */
  finalize(): Response {
    this.assertMutable();
    this.#finalized = true;

    return new Response(this.#body, {
      headers: this.#headers,
      status: this.#status,
      statusText: this.#statusText
    });
  }

  protected formatHeader(key: string, item: any) {
    if (key.toLowerCase() === "location") {
      // "back" is an alias for the referrer
      if (item === "back") {
        item = this.request.get("Referrer") || "/";
      }

      item = encodeUrl(String(item));
    }
    return item;
  }

  protected json(data: any) {
    this.assertMutable();
    this.#headers.set("content-type", "application/json; charset=utf-8");
    this.#body = JSON.stringify(data);
    this.#bodyCommitted = true;

    return this;
  }

  protected buffer(data: any) {
    if (!this.getContentType()) {
      this.contentType("application/octet-stream");
    }

    this.contentLength(data.length);
  }

  protected end(data?: string | Buffer) {
    if (data !== undefined) {
      this.#body = data as unknown as BodyInit;
    }
    this.#bodyCommitted = true;
  }

  private assertMutable() {
    if (this.#finalized) {
      throw new Error("PlatformResponse has already been finalized");
    }
  }
}

injectable(PlatformResponse).scope(ProviderScope.INSTANCE);
