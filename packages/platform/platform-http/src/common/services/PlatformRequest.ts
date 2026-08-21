import {injectable, ProviderScope} from "@tsed/di";
import type {PlatformContext} from "../domain/PlatformContext.js";
import type {PlatformResponse} from "./PlatformResponse.js";

export interface PlatformRequestAccessors {
  body?(): unknown;
  rawBody?(): unknown;
  cookies?(): Record<string, unknown> | undefined;
  params?(): Record<string, unknown>;
  session?(): unknown;
  files?(): unknown;
  accepts?(mime: string | string[] | undefined): string | string[] | false;
}

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
export class PlatformRequest<Req extends {[key: string]: any} = any> {
  constructor(readonly $ctx: PlatformContext) {}

  /**
   * The current @@PlatformResponse@@.
   */
  get response(): PlatformResponse {
    return this.$ctx.response;
  }

  /**
   * Host request attached by the active bridge.
   */
  get native(): Req | undefined {
    return this.$ctx.event?.request as any;
  }

  /**
   * Standard Fetch request supplied by direct Fetch execution.
   */
  get fetch(): Request {
    return this.$ctx.fetch;
  }

  /**
   * Non-portable alias for {@link native}.
   */
  get raw(): Req | undefined {
    return this.native;
  }

  get secure(): boolean {
    return new URL(this.fetch.url).protocol === "https:";
  }

  get host(): string {
    return this.get("host");
  }

  get protocol(): string {
    return new URL(this.fetch.url).protocol.replace(/:$/, "");
  }

  /**
   * Get the url of the request.
   *
   * Is equivalent of `express.response.originalUrl || express.response.url`.
   */
  get url(): string {
    const url = new URL(this.fetch.url);
    return `${url.pathname}${url.search}`;
  }

  get headers(): Record<string, string | string[] | undefined> {
    return Object.fromEntries(this.fetch.headers.entries());
  }

  get method(): string {
    return this.fetch.method;
  }

  /**
   * Contains key-value pairs of data submitted in the request body. By default, it is `undefined`, and is populated when you use
   * `body-parsing` middleware such as `express.json()` or `express.urlencoded()`.
   */
  get body(): any {
    return this.$ctx.accessors?.body?.();
  }

  get rawBody(): any {
    return this.$ctx.accessors?.rawBody?.();
  }

  /**
   * When using `cookie-parser` middleware, this property is an object that contains cookies sent by the request.
   * It is `undefined` when the active host does not expose a cookie capability.
   */
  get cookies(): Record<string, unknown> | undefined {
    return this.$ctx.accessors?.cookies?.();
  }

  /**
   * This property is an object containing properties mapped to the named route `parameters`.
   * For example, if you have the route `/user/:name`, then the `name` property is available as `req.params.name`.
   * This object defaults to `{}`.
   */
  get params(): Record<string, unknown> {
    return this.$ctx.accessors?.params?.() || {};
  }

  /**
   * This property is an object containing a property for each query string parameter in the route.
   * When query parser is set to disabled, it is an empty object `{}`, otherwise it is the result of the configured query parser.
   */
  get query(): {[key: string]: any} {
    return [...new URL(this.fetch.url).searchParams.entries()].reduce(
      (query, [key, value]) => {
        const current = query[key];
        query[key] = current === undefined ? value : Array.isArray(current) ? [...current, value] : [current, value];
        return query;
      },
      {} as Record<string, string | string[]>
    );
  }

  /**
   * This property is an object containing a property for each session attributes set by any code.
   * It is `undefined` unless the active host middleware exposes a session capability.
   */
  get session(): unknown {
    return this.$ctx.accessors?.session?.();
  }

  get files() {
    return this.$ctx.accessors?.files?.();
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
    return this.fetch?.headers.get(name) || this.raw?.get(name);
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
    return this.$ctx.accessors?.accepts?.(mime) || false;
  }

  isAborted() {
    return this.$ctx.runtime?.signal?.aborted || this.fetch?.signal.aborted || this.raw?.aborted;
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
  getReq<R = Req>(): R {
    return this.native as unknown as R;
  }
}

injectable(PlatformRequest).scope(ProviderScope.INSTANCE);
