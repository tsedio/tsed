import {DIContext, DIContextOptions} from "@tsed/di";
import {EndpointMetadata} from "@tsed/schema";
import {IncomingMessage, ServerResponse} from "http";
import {IncomingEvent} from "../interfaces/IncomingEvent";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";

declare global {
  namespace TsED {
    export interface Context extends PlatformContext {}
  }
}

export interface PlatformContextOptions extends DIContextOptions {
  event: IncomingEvent;
  ignoreUrlPatterns?: any[];
  endpoint?: EndpointMetadata;
}

export class PlatformContext<
  PReq extends PlatformRequest = PlatformRequest,
  PRes extends PlatformResponse = PlatformResponse
> extends DIContext {
  public event: IncomingEvent;
  /**
   * The data return by the previous endpoint if you use multiple handler on the same route. By default data is empty.
   */
  public data: any;
  /**
   * The error caught by the current handler
   */
  public error?: unknown;
  /**
   * The current @@PlatformResponse@@.
   */
  readonly response: PRes;
  /**
   * The current @@PlatformRequest@@.
   */
  readonly request: PReq;
  /**
   * The current @@EndpointMetadata@@ resolved by Ts.ED during the request.
   */
  endpoint: EndpointMetadata;

  #isDestroyed: boolean = false;

  constructor(options: PlatformContextOptions) {
    super(options);

    options.endpoint && (this.endpoint = options.endpoint);

    this.event = options.event;
    this.response = new (options.ResponseKlass || PlatformResponse)(this);
    this.request = new (options.RequestKlass || PlatformRequest)(this);

    this.request.request.$ctx = this;
    this.request.request.id = this.id;

    this.response.setHeader("x-request-id", this.id);
  }

  get url() {
    return this.request.url;
  }

  get app() {
    return this.injector.get<PlatformApplication>(PlatformApplication)!;
  }

  async destroy() {
    await super.destroy();

    this.event = {
      response: {
        isDone: true,
        statusCode: this.statusCode
      },
      request: {
        method: this.method,
        url: this.url,
        headers: this.headers,
        body: this.body,
        query: this.query,
        params: this.params
      }
    } as any;

    this.response.destroy();
    this.request.destroy();
    this.#isDestroyed = true;
  }

  isDone() {
    return this.request?.isAborted() || this.response?.isDone() || this.#isDestroyed;
  }

  /**
   * Return the framework request instance (Express, Koa, etc...)
   */
  getRequest<Req = any>(): Req {
    return this.request.getRequest<Req>();
  }

  /**
   * Return the framework response instance (Express, Koa, etc...)
   */
  getResponse<Res = any>(): Res {
    return this.response.getResponse<Res>();
  }

  /**
   * Get Node.js request
   */
  getReq(): IncomingMessage {
    return this.request.getReq();
  }

  /**
   * Get Node.js response
   */
  getRes(): ServerResponse {
    return this.response.getRes();
  }

  /**
   * Return the original application instance.
   */
  getApp<T = any>(): T {
    return this.app.getApp() as any;
  }
}
