import {isBoolean, isNumber, isStream, isString} from "@tsed/core";
import {DI_PARAM_OPTIONS, Injectable, InjectorService, Opts, ProviderScope, Scope} from "@tsed/di";
import {ServerResponse} from "http";

const onFinished = require("on-finished");

declare global {
  namespace TsED {
    // @ts-ignore
    export interface Response {
      // req: any;
    }
  }
}

/**
 * Platform Response abstraction layer.
 * @platform
 */
@Injectable()
@Scope(ProviderScope.INSTANCE)
export class PlatformResponse<T extends {[key: string]: any} = any> {
  constructor(@Opts public raw: T) {}

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
   * Create a new instance of PlatformResponse
   * @param injector
   * @param res
   */
  static create(injector: InjectorService, res: any) {
    const locals = new Map();
    locals.set(DI_PARAM_OPTIONS, res);

    return injector.invoke<PlatformResponse>(PlatformResponse, locals);
  }

  static onFinished(res: any, cb: Function) {
    onFinished(res, cb);
  }

  /**
   * Return the Node.js response object
   */
  getRes(): ServerResponse {
    return this.raw as any;
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
  setHeaders(headers: {[key: string]: any}) {
    // apply headers
    Object.entries(headers).forEach(([key, item]) => {
      this.setHeader(key, item);
    });

    return this;
  }

  setHeader(key: string, item: any) {
    this.raw.set(key, String(item));

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
  stream(data: ReadableStream | any) {
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
    return "PlatformResponse.render method is not implemented";
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
    if (data === undefined) {
      this.raw.send();

      return this;
    }

    if (isStream(data)) {
      this.stream(data);

      return this;
    }

    if (isBoolean(data) || isNumber(data) || isString(data) || data === null) {
      this.raw.send(data);

      return this;
    }

    this.raw.json(data);

    return this;
  }

  /**
   * Add a listener to handler the end of the request/response.
   * @param cb
   */
  onEnd(cb: Function): this {
    PlatformResponse.onFinished(this.getRes(), cb);

    return this;
  }

  isDone(): boolean {
    if (!this.raw) {
      return true;
    }
    const res = this.getRes();

    return Boolean(res.headersSent || res.writableEnded || res.writableFinished);
  }

  destroy() {
    // @ts-ignore
    delete this.raw;
  }
}
