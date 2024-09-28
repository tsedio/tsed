import {Injectable, ProviderScope, Scope} from "@tsed/di";
import {IncomingHttpHeaders, IncomingMessage} from "http";

import type {PlatformContext} from "../domain/PlatformContext.js";
import type {PlatformResponse} from "./PlatformResponse.js";

declare global {
  namespace TsED {
    // @ts-ignore
    export interface Request {
      id: string;
    }
  }
}

/**
 * Platform Request abstraction layer.
 * @platform
 */
@Injectable()
@Scope(ProviderScope.INSTANCE)
export class PlatformRequest<Req extends {[key: string]: any} = any> {
  constructor(readonly $ctx: PlatformContext) {}

  /**
   * The current @@PlatformResponse@@.
   */
  get response(): PlatformResponse {
    return this.$ctx.response;
  }

  get raw(): Req {
    return this.$ctx.event.request as any;
  }

  get secure(): boolean {
    return this.raw.secure;
  }

  get host(): string {
    return this.get("host");
  }

  get protocol(): string {
    return this.raw.protocol;
  }

  /**
   * Get the url of the request.
   *
   * Is equivalent of `express.response.originalUrl || express.response.url`.
   */
  get url(): string {
    return this.raw.originalUrl || this.raw.url;
  }

  get headers(): IncomingHttpHeaders {
    return this.raw.headers;
  }

  get method(): string {
    return this.raw.method;
  }

  /**
   * Contains key-value pairs of data submitted in the request body. By default, it is `undefined`, and is populated when you use
   * `body-parsing` middleware such as `express.json()` or `express.urlencoded()`.
   */
  get body(): any {
    return this.raw.body;
  }

  get rawBody(): any {
    return this.raw.rawBody || this.raw.body;
  }

  /**
   * When using `cookie-parser` middleware, this property is an object that contains cookies sent by the request.
   * If the request contains no cookies, it defaults to `{}`.
   */
  get cookies(): {[key: string]: any} {
    return this.raw.cookies;
  }

  /**
   * This property is an object containing properties mapped to the named route `parameters`.
   * For example, if you have the route `/user/:name`, then the `name` property is available as `req.params.name`.
   * This object defaults to `{}`.
   */
  get params(): {[key: string]: any} {
    return this.raw.params;
  }

  /**
   * This property is an object containing a property for each query string parameter in the route.
   * When query parser is set to disabled, it is an empty object `{}`, otherwise it is the result of the configured query parser.
   */
  get query(): {[key: string]: any} {
    return this.raw.query;
  }

  /**
   * This property is an object containing a property for each session attributes set by any code.
   * It requires to install a middleware like express-session to work.
   */
  get session(): {[key: string]: any} {
    return this.raw.session as any;
  }

  get files() {
    return this.raw.files;
  }

  get route() {
    return this.$ctx.handlerMetadata?.path;
  }

  /**
   * Return the original request framework instance
   */
  get request() {
    return this.getRequest();
  }

  /**
   * Return the original request node.js instance
   */
  get req() {
    return this.getReq();
  }

  /**
   * Returns the HTTP request header specified by field. The match is case-insensitive.
   *
   * ```typescript
   * request.get('Content-Type') // => "text/plain"
   * ```
   *
   * @param name
   */
  get(name: string) {
    return this.raw.get(name);
  }

  getHeader(name: string) {
    return this.get(name);
  }

  /**
   * Checks if the specified content types are acceptable, based on the request’s Accept HTTP header field. The method returns the best match, or if none of the specified content types is acceptable, returns false (in which case, the application should respond with 406 "Not Acceptable").
   *
   * The type value may be a single MIME type string (such as “application/json”), an extension name such as “json”, a comma-delimited list, or an array. For a list or array, the method returns the best match (if any).
   *
   * @param mime
   */
  accepts(mime: string): string | false;

  accepts(mime: string[]): string[] | false;

  accepts(mime?: string | string[]): string | string[] | false {
    // @ts-ignore
    return this.raw.accepts(mime);
  }

  isAborted() {
    return this.raw.aborted;
  }

  /**
   * Return the Framework response object (express, koa, etc...)
   */
  getRequest<R = Req>(): R {
    return this.raw as any;
  }

  /**
   * Return the Node.js response object
   */
  getReq(): IncomingMessage {
    return this.$ctx.event.request;
  }
}
