import {ProviderScope, injectable} from "@tsed/di";
import type {PlatformContext} from "../domain/PlatformContext.js";
import type {PlatformResponse} from "./PlatformResponse.js";

export interface PlatformParsedBody {
  body: unknown;
  rawBody?: unknown;
}

/**
 * Request-scoped capability populated by an explicit body-parser middleware or
 * host bridge. `platform-http` never consumes the Fetch body to populate it.
 */
export const PLATFORM_PARSED_BODY = Symbol.for("@tsed/platform-http/parsed-body");

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
  #params: Record<string, string> = {};

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
  get native(): Req {
    return this.$ctx.event?.request as any;
  }

  /**
   * Standard Fetch request supplied by direct Fetch execution.
   */
  get fetch(): Request | undefined {
    return this.$ctx.fetch;
  }

  /**
   * Non-portable alias for {@link native}.
   */
  get raw(): Req {
    return this.native;
  }

  get secure(): boolean {
    return this.fetch ? new URL(this.fetch.url).protocol === "https:" : this.raw?.secure;
  }

  get host(): string {
    return this.get("host");
  }

  get protocol(): string {
    return this.fetch ? new URL(this.fetch.url).protocol.replace(/:$/, "") : this.raw?.protocol;
  }

  /**
   * Get the url of the request.
   *
   * Is equivalent of `express.response.originalUrl || express.response.url`.
   */
  get url(): string {
    if (this.fetch) {
      const url = new URL(this.fetch.url);
      return `${url.pathname}${url.search}`;
    }

    return this.raw?.originalUrl || this.raw?.url;
  }

  get headers(): Record<string, string | string[] | undefined> {
    return this.fetch ? Object.fromEntries(this.fetch.headers.entries()) : this.raw?.headers;
  }

  get method(): string {
    return this.fetch?.method || this.raw?.method;
  }

  /**
   * Contains key-value pairs of data submitted in the request body. By default, it is `undefined`, and is populated when you use
   * `body-parsing` middleware such as `express.json()` or `express.urlencoded()`.
   */
  get body(): any {
    const parsed = this.$ctx.state.get(PLATFORM_PARSED_BODY) as PlatformParsedBody | undefined;
    return parsed ? parsed.body : this.fetch ? undefined : this.raw.body;
  }

  get rawBody(): any {
    const parsed = this.$ctx.state.get(PLATFORM_PARSED_BODY) as PlatformParsedBody | undefined;
    return parsed?.rawBody ?? (this.fetch ? undefined : this.raw.rawBody || this.raw.body);
  }

  /**
   * Publishes a result produced by an explicit body parser for this request.
   * This method does not read or parse the underlying Fetch request body.
   */
  setBody(body: unknown, rawBody?: unknown): this {
    this.$ctx.state.set(PLATFORM_PARSED_BODY, {body, rawBody});
    return this;
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
    return this.fetch ? this.#params : this.raw.params;
  }

  /** @internal Route compilation provides portable path parameters here. */
  setParams(params: Record<string, string>) {
    this.#params = params;
  }

  /**
   * This property is an object containing a property for each query string parameter in the route.
   * When query parser is set to disabled, it is an empty object `{}`, otherwise it is the result of the configured query parser.
   */
  get query(): {[key: string]: any} {
    if (!this.fetch) {
      return this.raw.query;
    }

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
    // @ts-ignore
    return this.raw.accepts(mime);
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
