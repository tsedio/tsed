import {DI_PARAM_OPTIONS, Injectable, InjectorService, Opts, ProviderScope, Scope} from "@tsed/di";
import {Req} from "../../mvc/decorators/params/request";

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class PlatformRequest {
  constructor(@Opts public raw: Req) {}

  /**
   * Get the url of the request.
   *
   * Is equivalent of `express.response.originalUrl || express.response.url`.
   */
  get url() {
    return this.raw.originalUrl || this.raw.url;
  }

  /**
   * Contains key-value pairs of data submitted in the request body. By default, it is `undefined`, and is populated when you use
   * `body-parsing` middleware such as `express.json()` or `express.urlencoded()`.
   */
  get body() {
    return this.raw.body;
  }

  /**
   * When using `cookie-parser` middleware, this property is an object that contains cookies sent by the request.
   * If the request contains no cookies, it defaults to `{}`.
   */
  get cookies() {
    return this.raw.cookies;
  }

  /**
   * This property is an object containing properties mapped to the named route `parameters`.
   * For example, if you have the route `/user/:name`, then the `name` property is available as `req.params.name`.
   * This object defaults to `{}`.
   */
  get params() {
    return this.raw.params;
  }

  /**
   * This property is an object containing a property for each query string parameter in the route.
   * When query parser is set to disabled, it is an empty object `{}`, otherwise it is the result of the configured query parser.
   */
  get query() {
    return this.raw.query;
  }

  /**
   * This property is an object containing a property for each session attributes set by any code.
   * It require to install a middleware like express-session to work.
   */
  get session() {
    return this.raw.session;
  }

  /**
   * Create a new instance of PlatformRequest
   * @param injector
   * @param req
   */
  static create(injector: InjectorService, req: Req) {
    const locals = new Map();
    locals.set(DI_PARAM_OPTIONS, req);

    return injector.invoke<PlatformRequest>(PlatformRequest, locals);
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

  /**
   * Checks if the specified content types are acceptable, based on the request’s Accept HTTP header field. The method returns the best match, or if none of the specified content types is acceptable, returns false (in which case, the application should respond with 406 "Not Acceptable").
   *
   * The type value may be a single MIME type string (such as “application/json”), an extension name such as “json”, a comma-delimited list, or an array. For a list or array, the method returns the best match (if any).
   *
   * @param mime
   */
  accepts(mime?: string | string[]) {
    // @ts-ignore
    return this.raw.accepts(mime);
  }

  destroy() {
    delete this.raw;
  }
}
