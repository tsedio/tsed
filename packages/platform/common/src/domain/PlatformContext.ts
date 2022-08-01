import {ContextMethods, DIContext, DIContextOptions} from "@tsed/di";
import {PlatformHandlerMetadata} from "@tsed/platform-router";
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

export class PlatformContext<PReq extends PlatformRequest = PlatformRequest, PRes extends PlatformResponse = PlatformResponse>
  extends DIContext
  implements ContextMethods
{
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
   *
   */
  public next?: any;
  /**
   * The current @@PlatformResponse@@.
   */
  readonly response: PRes;
  /**
   * The current @@PlatformRequest@@.
   */
  readonly request: PReq;

  private ignoreUrlPatterns: RegExp[] = [];
  #isDestroyed: boolean = false;

  constructor(options: PlatformContextOptions) {
    super(options);

    options.endpoint && (this.endpoint = options.endpoint);

    this.event = options.event;
    this.response = new (options.ResponseKlass || PlatformResponse)(this);
    this.request = new (options.RequestKlass || PlatformRequest)(this);

    this.request.request.$ctx = this;
    this.request.request.id = this.id;
    this.container.set(PlatformResponse, this.response);
    this.container.set(PlatformRequest, this.request);
    this.container.set(PlatformContext, this);

    try {
      this.response.setHeader("x-request-id", this.id);
    } catch (er) {}
  }

  /**
   * The current @@EndpointMetadata@@ resolved by Ts.ED during the request.
   */
  get endpoint() {
    return this.get(EndpointMetadata);
  }

  set endpoint(endpoint: EndpointMetadata) {
    this.set(EndpointMetadata, endpoint);
  }

  /**
   * The current @@PlatformHandlerMetadata@@ resolved by Ts.ED during the request.
   */
  get handlerMetadata() {
    return this.get(PlatformHandlerMetadata);
  }

  /**
   * The current @@PlatformHandlerMetadata@@ resolved by Ts.ED during the request.
   */
  set handlerMetadata(metadata: PlatformHandlerMetadata) {
    this.set(PlatformHandlerMetadata, metadata);
  }

  get url() {
    return this.request.url;
  }

  get app() {
    return this.injector.get<PlatformApplication>(PlatformApplication)!;
  }

  async start() {
    return this.emit("$onRequest", this);
  }

  async finish() {
    await this.emit("$onResponse", this);
    await this.destroy();
  }

  async destroy() {
    await super.destroy();
    this.upgrade({
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
    } as any);

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

  upgrade(event: IncomingEvent) {
    this.event = event;
  }
}
