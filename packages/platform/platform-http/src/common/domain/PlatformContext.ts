import {DIContext, DIContextOptions, injector} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {PlatformHandlerMetadata} from "@tsed/platform-router";
import {EndpointMetadata} from "@tsed/schema";
import {IncomingMessage, ServerResponse} from "http";

import {IncomingEvent} from "../interfaces/IncomingEvent.js";
import {PlatformApplication} from "../services/PlatformApplication.js";
import {PlatformRequest} from "../services/PlatformRequest.js";
import {PlatformResponse} from "../services/PlatformResponse.js";

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
  readonly PLATFORM: string = "WWW";
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
  /**
   * The current @@EndpointMetadata@@ resolved by Ts.ED during the request.
   */
  endpoint: EndpointMetadata;
  /**
   * The current @@PlatformHandlerMetadata@@ resolved by Ts.ED during the request.
   */
  handlerMetadata: PlatformHandlerMetadata;

  #isFinished: boolean = false;

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
    return injector().get<PlatformApplication>(PlatformApplication)!;
  }

  start() {
    return $asyncEmit("$onRequest", [this]);
  }

  async finish() {
    await Promise.all([$asyncEmit("$onResponse", [this]), this.destroy()]);
    this.#isFinished = true;
  }

  isFinished() {
    return this.#isFinished;
  }

  isDone() {
    return this.request?.isAborted() || this.response?.isDone() || this.isFinished();
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
