import {isBoolean, isNumber, isStream, isString} from "@tsed/core";
import {Injectable, ProviderScope, Scope} from "@tsed/di";
import {OutgoingHttpHeaders, ServerResponse} from "http";
import onFinished from "on-finished";
import type {PlatformContext} from "../domain/PlatformContext";
import {PlatformRequest} from "./PlatformRequest";

declare global {
  namespace TsED {
    // @ts-ignore
    export interface Response {}
  }
}

/**
 * Platform Response abstraction layer.
 * @platform
 */
@Injectable()
@Scope(ProviderScope.INSTANCE)
export class PlatformResponse<Res extends Record<string, any> = any> {
  data: any;

  constructor(readonly $ctx: PlatformContext) {}

  /**
   * The current @@PlatformRequest@@.
   */
  get request(): PlatformRequest {
    return this.$ctx.request;
  }

  get raw(): Res {
    return this.$ctx.event.response as any;
  }

  /**
   * Get the current statusCode
   */
  get statusCode() {
    return this.raw.statusCode;
  }

  /**
   * An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.
   *
   * This property is useful for exposing request-level information such as the request path name, authenticated user, user settings, and so on.
   */
  get locals() {
    return this.raw.locals;
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

  static onFinished(res: any, cb: (er: Error | null, message: string) => void) {
    onFinished(res, cb);
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
    return this.raw.get(name);
  }

  getHeaders(): OutgoingHttpHeaders {
    return this.raw.getHeaders();
  }

  /**
   * Return the Framework response object (express, koa, etc...)
   */
  getResponse<R = Res>(): R {
    return this.raw as any;
  }

  /**
   * Return the Node.js response object
   */
  getRes(): ServerResponse {
    return this.$ctx.event.response;
  }

  hasStatus() {
    return this.statusCode !== 200;
  }

  /**
   * Sets the HTTP status for the response.
   *
   * @param status
   */
  status(status: number) {
    this.raw.status(status);

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
    if (key.toLowerCase() === "location") {
      return this.location(String(item));
    }

    this.raw.set(key, item);

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
    this.raw.contentType(contentType);

    return this;
  }

  contentLength(length: number) {
    this.setHeader("Content-Length", length);
    return this;
  }

  getContentLength() {
    if (this.get("Content-Length")) {
      return parseInt(this.get("Content-Length"), 10) || 0;
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
    this.raw.attachment(filename);
    return this;
  }

  /**
   * Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).
   * If not specified, status defaults to `302 Found`.
   *
   * @param status
   * @param url
   */
  redirect(status: number, url: string) {
    this.raw.redirect(status, url);

    return this;
  }

  /**
   * Sets the response Location HTTP header to the specified path parameter.
   *
   * @param location
   */
  location(location: string) {
    this.raw.location(location);

    return this;
  }

  /**
   * Stream the given data.
   *
   * @param data
   */
  stream(data: any) {
    data.pipe(this.raw);

    return this;
  }

  /**
   * Renders a view and sends the rendered HTML string to the client.
   *
   * @param path
   * @param options
   */
  async render(path: string, options: any = {}) {
    const {PlatformViews} = await import("@tsed/platform-views");
    const platformViews = await this.$ctx.injector.lazyInvoke(PlatformViews);

    return platformViews.render(path, {
      ...this.locals,
      ...options
    });
  }

  /**
   * Send any data to your consumer.
   *
   * This method accept a ReadableStream, a plain object, boolean, string, number, null and undefined data.
   * It choose the better way to send the data.
   *
   * @param data
   */
  body(data: any) {
    this.data = data;

    if (data === undefined) {
      this.raw.send();

      return this;
    }

    if (isStream(data)) {
      this.stream(data);

      return this;
    }

    if (Buffer.isBuffer(data)) {
      if (!this.getContentType()) {
        this.contentType("application/octet-stream");
      }

      this.contentLength(data.length);
      this.raw.send(data);

      return this;
    }

    if (isBoolean(data) || isNumber(data) || isString(data) || data === null) {
      this.raw.send(data);

      return this;
    }

    this.raw.json(data);

    return this;
  }

  getBody() {
    return this.data;
  }

  /**
   * Add a listener to handler the end of the request/response.
   * @param cb
   */
  onEnd(cb: (er: Error | null, message: string) => void): this {
    PlatformResponse.onFinished(this.$ctx.event.response, cb);

    return this;
  }

  isDone(): boolean {
    if (this.raw.isDone) {
      return true;
    }

    const res = this.getRes();

    return Boolean(this.isHeadersSent() || res.writableEnded || res.writableFinished);
  }

  destroy() {
    this.data = undefined;
  }

  isHeadersSent() {
    return this.getRes().headersSent;
  }
}
