import {getValue} from "@tsed/core";
import {getStatusMessage} from "@tsed/schema";
import type {APIGatewayProxyEvent} from "aws-lambda";
import encodeUrl from "encodeurl";
import mime from "mime";

import {ServerlessContext} from "./ServerlessContext.js";

export type HeaderValue = boolean | number | string;

/**
 * @platform
 */
export class ServerlessResponse<Event extends object = APIGatewayProxyEvent> {
  #status: number = 200;
  #body: any = undefined;
  #headers: Record<string, HeaderValue> = {};
  #locals: Record<string, any> = {};
  #isHeadersSent = false;

  constructor(protected $ctx: ServerlessContext<Event>) {}

  get event() {
    return this.$ctx.event;
  }

  get raw() {
    return this.event;
  }

  get request() {
    return this.$ctx.request;
  }

  /**
   * Get the current statusCode
   */
  get statusCode() {
    return this.#status;
  }

  set statusCode(status) {
    this.#status = status;
  }

  /**
   * An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.
   *
   * This property is useful for exposing request-level information such as the request path name, authenticated user, user settings, and so on.
   */
  get locals() {
    return this.#locals;
  }

  get isHeadersSent() {
    return this.#isHeadersSent;
  }

  getStatus() {
    return this.#status;
  }

  /**
   * Sets the HTTP status for the response.
   *
   * @param status
   */
  status(status: number) {
    this.#status = status;
    return this;
  }

  set(name: string, value: any) {
    return this.setHeader(name, value);
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
  get(name: string): string | number | boolean | undefined {
    return getValue(this.#headers, name.toLowerCase());
  }

  getHeaders(): Record<string, HeaderValue> {
    return {
      ...this.#headers
    };
  }

  hasStatus() {
    return this.#status !== 200;
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
  setHeaders(headers: Record<string, HeaderValue>) {
    // apply headers
    Object.entries(headers).forEach(([key, item]) => {
      this.setHeader(key, item);
    });

    return this;
  }

  setHeader(key: string, item: HeaderValue | null | undefined) {
    if (item !== null && item !== undefined) {
      key = key.toLowerCase();

      if (key === "location") {
        // "back" is an alias for the referrer
        if (item === "back") {
          item = this.request.get("Referrer") || "/";
        }

        item = encodeUrl(String(item));
      }

      this.#headers = {
        ...this.#headers,
        [key.toLowerCase()]: item as any
      };
    }

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
    this.setHeader("Content-Type", mime.getType(contentType));

    return this;
  }

  contentLength(length: number) {
    this.setHeader("Content-Length", length);
    return this;
  }

  getContentLength() {
    if (this.get("Content-Length")) {
      return parseInt(this.get("Content-Length") as any, 10) || 0;
    }
  }

  getContentType() {
    return String(this.get("Content-Type") || "").split(";")[0];
  }

  /**
   * Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).
   * If not specified, status defaults to `302 Found`.
   *
   * @param status
   * @param url
   */
  redirect(status: number, url: string) {
    // Set location header
    const address = this.location(url).get("Location");
    const body = `${getStatusMessage(status)}. Redirecting to ${address}`;

    this.status(status).set("Content-Length", Buffer.byteLength(body)).body(body);

    return this;
  }

  /**
   * Sets the response Location HTTP header to the specified path parameter.
   *
   * @param url
   */
  location(url: string) {
    return this.set("Location", url);
  }

  /**
   * Send any data to your consumer.
   *
   * This method accept a ReadableStream, a plain object, boolean, string, number, null and undefined data.
   * It choose the better way to send the data.
   *
   * @param body
   */
  body(body: any) {
    this.#body = body;

    return this;
  }

  getBody() {
    return this.#body;
  }

  isDone(): boolean {
    return this.#isHeadersSent;
  }

  destroy() {
    this.#isHeadersSent = true;
  }
}
