import {DI_PARAM_OPTIONS, Injectable, InjectorService, Opts, ProviderScope, Scope} from "@tsed/di";
import {IncomingHttpHeaders} from "http";
import {RequestContext} from "../domain/RequestContext";

export interface PlatformBaseRequest {
  id: string;
  ctx: RequestContext;
}

declare global {
  namespace TsED {
    export interface Request {}
  }
}

/**
 * Platform Request abstraction layer.
 * @platform
 */
@Injectable()
@Scope(ProviderScope.INSTANCE)
export class PlatformRequest<T extends TsED.Request & {[key: string]: any} = any> {
  constructor(@Opts public raw: T) {}

  /**
   * Get the url of the request.
   *
   * Is equivalent of `express.response.originalUrl || express.response.url`.
   */
  get url() {
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
   * It require to install a middleware like express-session to work.
   */
  get session(): {[key: string]: any} {
    return this.raw.session as any;
  }

  /**
   * Create a new instance of PlatformRequest
   * @param injector
   * @param req
   */
  static create(injector: InjectorService, req: TsED.Request) {
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
  accepts(mime: string): string | false;
  accepts(mime: string[]): string[] | false;
  accepts(mime?: string | string[]): string | string[] | false {
    // @ts-ignore
    return this.raw.accepts(mime);
  }

  destroy() {
    // @ts-ignore
    delete this.raw;
  }
}
