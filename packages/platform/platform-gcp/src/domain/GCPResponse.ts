import {getValue} from "@tsed/core";
import {getStatusMessage} from "@tsed/schema";
import encodeUrl from "encodeurl";
import mime from "mime";

import {GCPContext} from "./GCPContext.js";
import {isHttpEvent} from "./GCPEvent.js";

type HeaderValue = string | string[] | number | boolean;

/**
 * @platform
 */
export class GCPResponse {
  #status: number = 200;
  #body: any;
  #headers: Record<string, HeaderValue> = {};
  #locals: Record<string, any> = {};
  #isHeadersSent: boolean = false;

  constructor(protected $ctx: GCPContext) {}

  get event() {
    return this.$ctx.event;
  }

  get raw(): any {
    return isHttpEvent(this.event) ? this.event.res : this.event;
  }

  get locals() {
    return this.#locals;
  }

  get request() {
    return this.$ctx.request;
  }

  get statusCode(): number {
    return this.#status;
  }

  set statusCode(status: number) {
    this.#status = status;
  }

  isHeadersSent(): boolean {
    return this.#isHeadersSent;
  }

  getStatus(): number {
    return this.#status;
  }

  status(status: number): this {
    this.#status = status;
    return this;
  }

  set(name: string, value: HeaderValue): this {
    return this.setHeader(name, value);
  }

  get(name: string): HeaderValue | undefined {
    return getValue(this.#headers, name.toLowerCase());
  }

  getHeaders(): Record<string, HeaderValue> {
    return {...this.#headers};
  }

  hasStatus(): boolean {
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
  setHeaders(headers: Record<string, HeaderValue>): this {
    Object.entries(headers).forEach(([key, item]) => {
      this.setHeader(key, item);
    });

    return this;
  }

  setHeader(key: string, item: HeaderValue): this {
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

  contentType(contentType: string): this {
    if (contentType.indexOf("/") === -1) {
      const lookup = mime.getType(contentType);

      if (lookup) {
        contentType = lookup;
      }
    }

    return this.set("Content-Type", contentType);
  }

  contentLength(length: number): this {
    return this.set("Content-Length", length);
  }

  getContentLength(): number {
    const length = this.get("Content-Length");
    return length ? +length : 0;
  }

  getContentType(): string | undefined {
    return this.get("Content-Type") as string | undefined;
  }

  /**
   * Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).
   * If not specified, status defaults to `302 Found`.
   *
   * @param status
   * @param url
   */
  redirect(status: number, url: string): this {
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
  location(url: string): this {
    return this.set("Location", url);
  }

  body(body: any): this {
    this.#body = body;

    return this;
  }

  getBody(): any {
    return this.#body;
  }

  isDone(): boolean {
    return this.#isHeadersSent;
  }

  destroy() {
    this.#isHeadersSent = true;
  }
}
