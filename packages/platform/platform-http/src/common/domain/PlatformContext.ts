import {DIContext, DIContextOptions, injector} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {PlatformNativeContext} from "../fetch/PlatformHostBridge.js";
import {JsonMethodStore} from "@tsed/schema";
import {PlatformApplication} from "../services/PlatformApplication.js";
import {PlatformHandlerMetadata} from "@tsed/platform-router";
import {PlatformRequest} from "../services/PlatformRequest.js";
import {PlatformResponse} from "../services/PlatformResponse.js";

declare global {
  namespace TsED {
    export interface Context extends PlatformContext {}
  }
}

export interface PlatformContextOptions extends DIContextOptions {
  event: PlatformNativeContext;
  ignoreUrlPatterns?: any[];
  endpoint?: JsonMethodStore;
}

export class PlatformContext<PReq extends PlatformRequest = PlatformRequest> extends DIContext {
  readonly PLATFORM: string = "WWW";
  public event: PlatformNativeContext;
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
  readonly response: PlatformResponse;
  /**
   * The current @@PlatformRequest@@.
   */
  readonly request: PReq;
  /**
   * The current @@JsonMethodStore@@ resolved by Ts.ED during the request.
   */
  endpoint!: JsonMethodStore;
  /**
   * The current @@PlatformHandlerMetadata@@ resolved by Ts.ED during the request.
   */
  handlerMetadata!: PlatformHandlerMetadata;

  #isFinished: boolean = false;

  constructor(options: PlatformContextOptions) {
    super(options);

    options.endpoint && (this.endpoint = options.endpoint);

    this.event = options.event;
    this.response = new PlatformResponse(this);
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
  getReq<Req = unknown>(): Req {
    return this.request.getReq<Req>();
  }

  /**
   * Get Node.js response
   */
  getRes<Res = unknown>(): Res {
    return this.response.getRes<Res>();
  }

  /**
   * Return the original application instance.
   */
  getApp<T = any>(): T {
    return this.app.getApp() as any;
  }
}
