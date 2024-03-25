import {getValue} from "@tsed/core";
import type {PlatformContext} from "./PlatformContext";
import type {PlatformContextOpts} from "./PlatformContextOpts";

/**
 * @platform
 */
export class PlatformRequest<Opts extends PlatformContextOpts = PlatformContextOpts> {
  constructor(protected $ctx: PlatformContext<Opts>) {}

  get response() {
    return this.$ctx.response;
  }

  get secure(): boolean {
    return !!this.$ctx.opts.secure;
  }

  get host(): string {
    return this.get("host");
  }

  get protocol(): string {
    return this.$ctx.opts.protocol!;
  }

  /**
   * Get the url of the request.
   *
   * Is equivalent of `express.response.originalUrl || express.response.url`.
   */
  get url(): string {
    return this.$ctx.opts.url!;
  }

  get headers(): Record<string, string> {
    return this.$ctx.opts.headers!;
  }

  get method(): string {
    return this.$ctx.opts.method!;
  }

  /**
   * Contains key-value pairs of data submitted in the request body. By default, it is `undefined`, and is populated when you use
   * `body-parsing` middleware such as `express.json()` or `express.urlencoded()`.
   */
  get body(): any {
    const {body} = this.$ctx.opts
    try {
      return body ? JSON.parse(body) : {};
    } catch (er) {
      return body;
    }
  }

  get rawBody(): any {
    return this.$ctx.opts.body;
  }

  /**
   * This property is an object containing properties mapped to the named route `parameters`.
   * For example, if you have the route `/user/:name`, then the `name` property is available as `req.params.name`.
   * This object defaults to `{}`.
   */
  get params(): {[key: string]: any} {
    return this.$ctx.opts.params || {};
  }

  /**
   * This property is an object containing a property for each query string parameter in the route.
   * When query parser is set to disabled, it is an empty object `{}`, otherwise it is the result of the configured query parser.
   */
  get query(): {[key: string]: any} {
    return this.$ctx.opts.query!;
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
    return getValue(this.headers, name);
  }
}
